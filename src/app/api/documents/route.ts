import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import documentsData from '@/data/documents.json';

// Helper to slugify document names for file names
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9 -]/g, '') // Remove non-alphanumeric characters
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/-+/g, '-'); // Collapse multiple -
}

// Helper to write file directly to GitHub repository via REST API
async function saveToGitHub(filePath: string, base64Data: string, message: string) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error('GITHUB_TOKEN env variable not set');

  const owner = 'xddswi-swiss';
  const repo = 'lebenslauf';
  const branch = 'main';
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;

  // 1. Try to get the SHA of the file if it already exists
  let sha: string | undefined;
  try {
    const getRes = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'NextJS-CV-App'
      }
    });
    if (getRes.ok) {
      const data = await getRes.json();
      sha = data.sha;
    }
  } catch (err) {
    console.log(`File ${filePath} does not exist on GitHub yet or error fetching SHA. Creating as new file.`);
  }

  // 2. Put content to GitHub
  const putRes = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'User-Agent': 'NextJS-CV-App'
    },
    body: JSON.stringify({
      message,
      content: base64Data,
      ...(sha && { sha }),
      branch
    })
  });

  if (!putRes.ok) {
    const errorText = await putRes.text();
    throw new Error(`GitHub API error: ${putRes.status} - ${errorText}`);
  }
}

export async function GET() {
  try {
    const jsonPath = path.join(process.cwd(), 'src', 'data', 'documents.json');
    const fileContent = await fs.readFile(jsonPath, 'utf8');
    const data = JSON.parse(fileContent);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading documents.json, returning static import:', error);
    return NextResponse.json(documentsData);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { passcode, deTerm, trTerm, enTerm, date, pdfFile } = body;

    // Validate passcode
    if (passcode !== 'eren2026') {
      return NextResponse.json({ error: 'Falsches Passwort / Yanlış Şifre / Incorrect Password' }, { status: 401 });
    }

    if (!deTerm || !date || !pdfFile || !pdfFile.base64 || !pdfFile.name) {
      return NextResponse.json({ error: 'Fehlende Felder / Eksik alanlar / Missing required fields (German Title, Year/Date and PDF file are required)' }, { status: 400 });
    }

    const slug = slugify(deTerm);
    const pdfFileName = `${slug}.pdf`;
    const pdfPath = `/assets/pdfs/${pdfFileName}`;
    const pdfGitHubPath = `public/assets/pdfs/${pdfFileName}`;
    
    let base64Data = pdfFile.base64;
    if (base64Data.includes(';base64,')) {
      base64Data = base64Data.split(';base64,')[1];
    }
    
    let readOnly = false;
    let writeErrors: string[] = [];

    // 1. Process PDF Report File and save locally
    try {
      const buffer = Buffer.from(base64Data, 'base64');
      const pdfsDir = path.join(process.cwd(), 'public', 'assets', 'pdfs');
      await fs.mkdir(pdfsDir, { recursive: true });
      const pdfFullPath = path.join(pdfsDir, pdfFileName);
      await fs.writeFile(pdfFullPath, buffer);
    } catch (err: any) {
      console.error('Error writing PDF report locally:', err);
      writeErrors.push(`PDF report local save failed: ${err.message}`);
      readOnly = true;
    }

    // 2. Read existing documents JSON
    const jsonPath = path.join(process.cwd(), 'src', 'data', 'documents.json');
    let currentData: any = { de: [], tr: [], en: [] };

    try {
      const fileContent = await fs.readFile(jsonPath, 'utf8');
      currentData = JSON.parse(fileContent);
    } catch (err) {
      console.log('Error reading documents.json, initializing empty template.');
    }

    // Ensure array structures exist
    if (!currentData.de) currentData.de = [];
    if (!currentData.tr) currentData.tr = [];
    if (!currentData.en) currentData.en = [];

    // Fallbacks for translation titles
    const trTitle = trTerm?.trim() || deTerm.trim();
    const enTitle = enTerm?.trim() || deTerm.trim();

    // Create new document items
    const newDeItem = { term: deTerm.trim(), date: date.trim(), file: pdfPath };
    const newTrItem = { term: trTitle, date: date.trim(), file: pdfPath };
    const newEnItem = { term: enTitle, date: date.trim(), file: pdfPath };

    // Push new items
    currentData.de.push(newDeItem);
    currentData.tr.push(newTrItem);
    currentData.en.push(newEnItem);

    const updatedJsonString = JSON.stringify(currentData, null, 2);

    // 3. Write updated JSON locally
    try {
      await fs.writeFile(jsonPath, updatedJsonString, 'utf8');
    } catch (err: any) {
      console.error('Error writing documents.json locally:', err);
      writeErrors.push(`JSON database local save failed: ${err.message}`);
      readOnly = true;
    }

    // 4. Sync with GitHub if GITHUB_TOKEN is configured (Production Vercel workflow)
    const githubToken = process.env.GITHUB_TOKEN;
    if (githubToken && !readOnly) {
      try {
        // Upload the PDF
        await saveToGitHub(
          pdfGitHubPath,
          base64Data,
          `Upload PDF document: ${pdfFileName}`
        );

        // Upload the updated JSON database
        const jsonBase64 = Buffer.from(updatedJsonString, 'utf8').toString('base64');
        await saveToGitHub(
          'src/data/documents.json',
          jsonBase64,
          `Add new document experience: ${deTerm}`
        );
      } catch (ghErr: any) {
        console.error('Error syncing changes with GitHub:', ghErr);
        writeErrors.push(`GitHub Sync failed: ${ghErr.message}`);
        // Return 200 anyway because it saved locally, but warning the user
        return NextResponse.json({
          success: true,
          warning: 'Saved locally, but failed syncing to GitHub.',
          errors: writeErrors
        });
      }
    }

    return NextResponse.json({
      success: !readOnly,
      errors: writeErrors.length > 0 ? writeErrors : undefined
    });

  } catch (error: any) {
    console.error('API Server Error during document addition:', error);
    return NextResponse.json({ error: `Internal Server Error: ${error.message}` }, { status: 500 });
  }
}
