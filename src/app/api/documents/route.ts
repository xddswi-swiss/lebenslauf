import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

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
    // Fetch all documents from Supabase
    const { data: dbData, error } = await supabaseAdmin
      .from('documents')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Format documents back to { de: [], tr: [], en: [] } for frontend compatibility
    const de: any[] = [];
    const tr: any[] = [];
    const en: any[] = [];

    for (const item of dbData || []) {
      de.push({ term: item.de_term, date: item.date, file: item.file_path });
      tr.push({ term: item.tr_term, date: item.date, file: item.file_path });
      en.push({ term: item.en_term, date: item.date, file: item.file_path });
    }

    return NextResponse.json({ de, tr, en });
  } catch (error: any) {
    console.error('Error fetching documents from Supabase:', error);
    return NextResponse.json({ error: `Database Error: ${error.message}` }, { status: 500 });
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
      return NextResponse.json({ error: 'Fehlende Felder / Eksik alanlar / Missing required fields (Title, Year and PDF file are required)' }, { status: 400 });
    }

    const slug = slugify(deTerm);
    const pdfFileName = `${slug}.pdf`;
    const pdfPath = `/assets/pdfs/${pdfFileName}`;
    
    let base64Data = pdfFile.base64;
    if (base64Data.includes(';base64,')) {
      base64Data = base64Data.split(';base64,')[1];
    }

    // 1. Process PDF File and save locally
    try {
      const buffer = Buffer.from(base64Data, 'base64');
      const pdfsDir = path.join(process.cwd(), 'public', 'assets', 'pdfs');
      await fs.mkdir(pdfsDir, { recursive: true });
      await fs.writeFile(path.join(pdfsDir, pdfFileName), buffer);

      // Upload to GitHub if token exists
      const githubToken = process.env.GITHUB_TOKEN;
      if (githubToken) {
        await saveToGitHub(`public/assets/pdfs/${pdfFileName}`, base64Data, `Upload PDF document: ${pdfFileName}`);
      }
    } catch (err: any) {
      console.error('Error saving PDF file locally/GitHub:', err);
    }

    // 2. Insert metadata into Supabase
    const { error: dbError } = await supabaseAdmin
      .from('documents')
      .insert({
        de_term: deTerm.trim(),
        tr_term: trTerm?.trim() || deTerm.trim(),
        en_term: enTerm?.trim() || deTerm.trim(),
        date: date.trim(),
        file_path: pdfPath
      });

    if (dbError) throw dbError;

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('API Server Error during document addition:', error);
    return NextResponse.json({ error: `Internal Server Error: ${error.message}` }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { passcode, term } = body;

    // Validate passcode
    if (passcode !== 'eren2026') {
      return NextResponse.json({ error: 'Falsches Passwort / Yanlış Şifre / Incorrect Password' }, { status: 401 });
    }

    if (!term) {
      return NextResponse.json({ error: 'Missing term' }, { status: 400 });
    }

    // Delete record from Supabase by checking all translation columns
    const { error: dbError } = await supabaseAdmin
      .from('documents')
      .delete()
      .or(`de_term.eq."${term.trim()}",tr_term.eq."${term.trim()}",en_term.eq."${term.trim()}"`);

    if (dbError) throw dbError;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('API DELETE Error for documents:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
