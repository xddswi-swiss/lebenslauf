import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import experiencesData from '@/data/experiences.json';

// Helper to slugify company name for file names
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

// Helper to normalize period inputs (e.g. "6/2026" -> "06/2026", "6.2026" -> "06/2026")
function normalizePeriod(period: string): string {
  const clean = period.trim();

  // Helper to normalize individual date part (like "6/2026" -> "06/2026")
  const normalizePart = (part: string) => {
    const p = part.trim();
    const match = p.match(/^(\d{1,2})[\/\.\-–](\d{4})$/);
    if (match) {
      const month = match[1].padStart(2, '0');
      const year = match[2];
      return `${month}/${year}`;
    }
    return p;
  };

  // 1. Try to normalize as a single date first
  const singleNormalized = normalizePart(clean);
  if (singleNormalized !== clean && singleNormalized.includes('/')) {
    return singleNormalized;
  }

  // 2. Otherwise, check if it's a range (contains -, –, —, "bis", "to")
  const parts = clean.split(/\s*([-–—]|bis|to)\s*/);
  if (parts.length >= 3) {
    // Reconstruct normalized range
    const start = normalizePart(parts[0]);
    const separator = parts[1];
    const end = normalizePart(parts[2]);
    return `${start} ${separator} ${end}`;
  }

  return singleNormalized;
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
    const jsonPath = path.join(process.cwd(), 'src', 'data', 'experiences.json');
    const fileContent = await fs.readFile(jsonPath, 'utf8');
    const data = JSON.parse(fileContent);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading experiences.json, returning static import:', error);
    return NextResponse.json(experiencesData);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { passcode, type = 'work', company, city, period, de, tr, en, pdfFile, logoFile } = body;

    // Validate passcode
    if (passcode !== 'eren2026') {
      return NextResponse.json({ error: 'Falsches Passwort / Yanlış Şifre / Incorrect Password' }, { status: 401 });
    }

    // Resolve fallback roles and tasks so user doesn't have to fill in all three languages
    const deRole = de?.role?.trim() || tr?.role?.trim() || en?.role?.trim() || '';
    const trRole = tr?.role?.trim() || deRole;
    const enRole = en?.role?.trim() || deRole;

    const deTasks = (de?.tasks && de.tasks.length > 0) ? de.tasks : (tr?.tasks && tr.tasks.length > 0) ? tr.tasks : (en?.tasks && en.tasks.length > 0) ? en.tasks : [];
    const trTasks = (tr?.tasks && tr.tasks.length > 0) ? tr.tasks : deTasks;
    const enTasks = (en?.tasks && en.tasks.length > 0) ? en.tasks : deTasks;

    const normalizedPeriod = normalizePeriod(period || '');

    if (!company || !city || !normalizedPeriod || !deRole) {
      return NextResponse.json({ error: 'Fehlende Felder / Eksik alanlar / Missing required fields (Company, City, Period and at least one Role/Tasks are required)' }, { status: 400 });
    }

    const slug = slugify(company);
    let pdfPath = '';
    let logoPath = '';
    let readOnly = false;
    let writeErrors: string[] = [];

    let logoBase64ToUpload = '';
    let logoGitHubPath = '';
    let pdfBase64ToUpload = '';
    let pdfGitHubPath = '';

    // 1. Process Logo File if uploaded
    if (logoFile && logoFile.base64 && logoFile.name) {
      try {
        const logoExt = path.extname(logoFile.name) || '.png';
        const logoFileName = `${slug}${logoExt}`;
        logoPath = `/assets/bilder/${logoFileName}`;
        logoGitHubPath = `public/assets/bilder/${logoFileName}`;
        
        let base64Data = logoFile.base64;
        if (base64Data.includes(';base64,')) {
          base64Data = base64Data.split(';base64,')[1];
        }
        logoBase64ToUpload = base64Data;
        const buffer = Buffer.from(base64Data, 'base64');
        
        const bilderDir = path.join(process.cwd(), 'public', 'assets', 'bilder');
        await fs.mkdir(bilderDir, { recursive: true });
        const logoFullPath = path.join(bilderDir, logoFileName);
        await fs.writeFile(logoFullPath, buffer);
      } catch (err: any) {
        console.error('Error writing logo image locally:', err);
        writeErrors.push(`Logo image local save failed: ${err.message}`);
        readOnly = true;
      }
    }

    // 2. Process PDF Report File if uploaded
    if (pdfFile && pdfFile.base64 && pdfFile.name) {
      try {
        const pdfFileName = `${slug}.pdf`;
        pdfPath = `/assets/pdfs/${pdfFileName}`;
        pdfGitHubPath = `public/assets/pdfs/${pdfFileName}`;
        
        let base64Data = pdfFile.base64;
        if (base64Data.includes(';base64,')) {
          base64Data = base64Data.split(';base64,')[1];
        }
        pdfBase64ToUpload = base64Data;
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
    }

    // 3. Create the new experience entries
    const newExperience = {
      de: {
        type,
        period: normalizedPeriod,
        role: deRole,
        company,
        city,
        tasks: deTasks,
        ...(pdfPath && { pdfReport: pdfPath }),
        ...(logoPath && { imageUrl: logoPath })
      },
      tr: {
        type,
        period: normalizedPeriod,
        role: trRole,
        company,
        city,
        tasks: trTasks,
        ...(pdfPath && { pdfReport: pdfPath }),
        ...(logoPath && { imageUrl: logoPath })
      },
      en: {
        type,
        period: normalizedPeriod,
        role: enRole,
        company,
        city,
        tasks: enTasks,
        ...(pdfPath && { pdfReport: pdfPath }),
        ...(logoPath && { imageUrl: logoPath })
      }
    };

    // 4. Update experiences.json
    let updatedData: any = {};
    const jsonPath = path.join(process.cwd(), 'src', 'data', 'experiences.json');

    let currentData: any = { de: [], tr: [], en: [] };
    try {
      const fileContent = await fs.readFile(jsonPath, 'utf8');
      currentData = JSON.parse(fileContent);
    } catch (e) {
      // Fallback to static experiencesData if read fails
      currentData = JSON.parse(JSON.stringify(experiencesData));
    }

    // Prepend to array
    updatedData = {
      de: [newExperience.de, ...(currentData.de || [])],
      tr: [newExperience.tr, ...(currentData.tr || [])],
      en: [newExperience.en, ...(currentData.en || [])]
    };

    try {
      if (!readOnly) {
        await fs.writeFile(jsonPath, JSON.stringify(updatedData, null, 2), 'utf8');
      }
    } catch (err: any) {
      console.error('Error writing experiences.json locally:', err);
      writeErrors.push(`JSON local write failed: ${err.message}`);
      readOnly = true;
    }

    if (readOnly) {
      const token = process.env.GITHUB_TOKEN;
      if (token) {
        try {
          // 1. Upload Logo to GitHub if present
          if (logoBase64ToUpload && logoGitHubPath) {
            await saveToGitHub(logoGitHubPath, logoBase64ToUpload, `Upload logo for ${company}`);
          }
          // 2. Upload PDF to GitHub if present
          if (pdfBase64ToUpload && pdfGitHubPath) {
            await saveToGitHub(pdfGitHubPath, pdfBase64ToUpload, `Upload PDF report for ${company}`);
          }
          // 3. Upload updated experiences.json to GitHub
          const jsonBase64 = Buffer.from(JSON.stringify(updatedData, null, 2), 'utf8').toString('base64');
          await saveToGitHub('src/data/experiences.json', jsonBase64, `Add new experience at ${company} via Admin Panel`);

          return NextResponse.json({
            success: true,
            githubSync: true,
            message: 'Erfolgreich über GitHub hinzugefügt / GitHub üzerinden başarıyla eklendi / Successfully added via GitHub. Site rebuilding...',
            newExperience,
            data: updatedData
          });
        } catch (gitErr: any) {
          console.error('Error syncing with GitHub API:', gitErr);
          writeErrors.push(`GitHub sync failed: ${gitErr.message}`);
        }
      }

      // Return readOnly flag along with the formatted JSON for fallback copy-paste if GITHUB_TOKEN is missing or push failed
      return NextResponse.json({
        success: false,
        readOnly: true,
        message: 'Hosting environment is read-only. GITHUB_TOKEN environment variable is missing or GitHub write failed.',
        errors: writeErrors,
        newExperience,
        jsonBackup: updatedData
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Erfolgreich hinzugefügt / Başarıyla Eklendi / Successfully Added',
      data: updatedData
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { passcode, company, period } = body;

    // Validate passcode
    if (passcode !== 'eren2026') {
      return NextResponse.json({ error: 'Falsches Passwort / Yanlış Şifre / Incorrect Password' }, { status: 401 });
    }

    if (!company || !period) {
      return NextResponse.json({ error: 'Missing company or period' }, { status: 400 });
    }

    const jsonPath = path.join(process.cwd(), 'src', 'data', 'experiences.json');
    let currentData: any = { de: [], tr: [], en: [] };

    try {
      const fileContent = await fs.readFile(jsonPath, 'utf8');
      currentData = JSON.parse(fileContent);
    } catch (e) {
      currentData = JSON.parse(JSON.stringify(experiencesData));
    }

    const normalizedPeriod = normalizePeriod(period || '');
    // Filter out the item to delete
    const filterFn = (item: any) => {
      return !(item.company.toLowerCase().trim() === company.toLowerCase().trim() && normalizePeriod(item.period) === normalizedPeriod);
    };

    const updatedData = {
      de: (currentData.de || []).filter(filterFn),
      tr: (currentData.tr || []).filter(filterFn),
      en: (currentData.en || []).filter(filterFn)
    };

    let readOnly = false;
    let writeError = '';

    try {
      await fs.writeFile(jsonPath, JSON.stringify(updatedData, null, 2), 'utf8');
    } catch (err: any) {
      console.error('Error writing experiences.json in DELETE:', err);
      writeError = err.message;
      readOnly = true;
    }

    if (readOnly) {
      const token = process.env.GITHUB_TOKEN;
      if (token) {
        try {
          const jsonBase64 = Buffer.from(JSON.stringify(updatedData, null, 2), 'utf8').toString('base64');
          await saveToGitHub('src/data/experiences.json', jsonBase64, `Delete experience at ${company} via Admin Panel`);

          return NextResponse.json({
            success: true,
            githubSync: true,
            message: 'Erfolgreich über GitHub gelöscht / GitHub üzerinden başarıyla silindi / Successfully deleted via GitHub. Site rebuilding...',
            data: updatedData
          });
        } catch (gitErr: any) {
          console.error('Error syncing DELETE with GitHub API:', gitErr);
          writeError = `GitHub sync failed: ${gitErr.message}`;
        }
      }

      return NextResponse.json({
        success: false,
        readOnly: true,
        message: 'Hosting environment is read-only. GITHUB_TOKEN environment variable is missing or GitHub write failed.',
        error: writeError,
        jsonBackup: updatedData
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Erfolgreich gelöscht / Başarıyla Silindi / Successfully Deleted',
      data: updatedData
    });
  } catch (error: any) {
    console.error('API DELETE Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
