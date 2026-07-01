import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { supabaseAdmin } from '@/lib/supabase';

// Helper to slugify names for file saving
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
    // Query experiences table from Supabase
    const { data: dbData, error } = await supabaseAdmin
      .from('experiences')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Format experiences back to { de: [], tr: [], en: [] } for frontend compatibility
    const de: any[] = [];
    const tr: any[] = [];
    const en: any[] = [];

    for (const item of dbData || []) {
      de.push({
        company: item.company,
        city: item.city,
        period: item.period,
        type: item.type,
        role: item.de?.role || '',
        tasks: item.de?.tasks || [],
        logo: item.logo_path || '',
        pdf: item.pdf_path || ''
      });
      tr.push({
        company: item.company,
        city: item.city,
        period: item.period,
        type: item.type,
        role: item.tr?.role || '',
        tasks: item.tr?.tasks || [],
        logo: item.logo_path || '',
        pdf: item.pdf_path || ''
      });
      en.push({
        company: item.company,
        city: item.city,
        period: item.period,
        type: item.type,
        role: item.en?.role || '',
        tasks: item.en?.tasks || [],
        logo: item.logo_path || '',
        pdf: item.pdf_path || ''
      });
    }

    return NextResponse.json({ de, tr, en });
  } catch (error: any) {
    console.error('Error fetching experiences from Supabase:', error);
    return NextResponse.json({ error: `Database Error: ${error.message}` }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { passcode, type, company, city, period, de, tr, en, pdfFile, logoFile } = body;

    // Validate passcode
    if (passcode !== 'eren2026') {
      return NextResponse.json({ error: 'Falsches Passwort / Yanlış Şifre / Incorrect Password' }, { status: 401 });
    }

    if (!company || !city || !period || !de?.role) {
      return NextResponse.json({ error: 'Fehlende Felder / Eksik alanlar / Missing required fields (Company, City, Period and German Role are required)' }, { status: 400 });
    }

    const slug = slugify(company);
    let logoPath = '';
    let pdfPath = '';

    // 1. Process Logo File
    if (logoFile && logoFile.base64 && logoFile.name) {
      const logoFileName = `${slug}${path.extname(logoFile.name)}`;
      logoPath = `/assets/bilder/${logoFileName}`;
      
      let base64Data = logoFile.base64;
      if (base64Data.includes(';base64,')) {
        base64Data = base64Data.split(';base64,')[1];
      }
      
      try {
        const buffer = Buffer.from(base64Data, 'base64');
        const bilderDir = path.join(process.cwd(), 'public', 'assets', 'bilder');
        await fs.mkdir(bilderDir, { recursive: true });
        await fs.writeFile(path.join(bilderDir, logoFileName), buffer);

        // Upload to GitHub
        const githubToken = process.env.GITHUB_TOKEN;
        if (githubToken) {
          await saveToGitHub(`public/assets/bilder/${logoFileName}`, base64Data, `Upload logo for ${company}`);
        }
      } catch (err: any) {
        console.error('Error processing logo:', err);
      }
    }

    // 2. Process PDF Report File
    if (pdfFile && pdfFile.base64 && pdfFile.name) {
      const pdfFileName = `${slug}.pdf`;
      pdfPath = `/assets/pdfs/${pdfFileName}`;
      
      let base64Data = pdfFile.base64;
      if (base64Data.includes(';base64,')) {
        base64Data = base64Data.split(';base64,')[1];
      }
      
      try {
        const buffer = Buffer.from(base64Data, 'base64');
        const pdfsDir = path.join(process.cwd(), 'public', 'assets', 'pdfs');
        await fs.mkdir(pdfsDir, { recursive: true });
        await fs.writeFile(path.join(pdfsDir, pdfFileName), buffer);

        // Upload to GitHub
        const githubToken = process.env.GITHUB_TOKEN;
        if (githubToken) {
          await saveToGitHub(`public/assets/pdfs/${pdfFileName}`, base64Data, `Upload PDF report for ${company}`);
        }
      } catch (err: any) {
        console.error('Error processing PDF report:', err);
      }
    }

    // 3. Insert record into Supabase
    const { error: dbError } = await supabaseAdmin
      .from('experiences')
      .insert({
        company: company.trim(),
        city: city.trim(),
        period: period.trim(),
        type: type || 'work',
        de: { role: de.role.trim(), tasks: de.tasks || [] },
        tr: { role: tr?.role?.trim() || de.role.trim(), tasks: tr?.tasks || de.tasks || [] },
        en: { role: en?.role?.trim() || de.role.trim(), tasks: en?.tasks || de.tasks || [] },
        logo_path: logoPath,
        pdf_path: pdfPath
      });

    if (dbError) throw dbError;

    // Fetch updated experiences to return for optimistic UI updates
    const { data: updatedDbData } = await supabaseAdmin
      .from('experiences')
      .select('*')
      .order('created_at', { ascending: true });

    // Format experiences back to { de: [], tr: [], en: [] } for frontend
    const deList: any[] = [];
    const trList: any[] = [];
    const enList: any[] = [];

    for (const item of updatedDbData || []) {
      deList.push({
        company: item.company,
        city: item.city,
        period: item.period,
        type: item.type,
        role: item.de?.role || '',
        tasks: item.de?.tasks || [],
        logo: item.logo_path || '',
        pdf: item.pdf_path || ''
      });
      trList.push({
        company: item.company,
        city: item.city,
        period: item.period,
        type: item.type,
        role: item.tr?.role || '',
        tasks: item.tr?.tasks || [],
        logo: item.logo_path || '',
        pdf: item.pdf_path || ''
      });
      enList.push({
        company: item.company,
        city: item.city,
        period: item.period,
        type: item.type,
        role: item.en?.role || '',
        tasks: item.en?.tasks || [],
        logo: item.logo_path || '',
        pdf: item.pdf_path || ''
      });
    }

    return NextResponse.json({
      success: true,
      data: { de: deList, tr: trList, en: enList }
    });

  } catch (error: any) {
    console.error('API Server Error during experience addition:', error);
    return NextResponse.json({ error: `Internal Server Error: ${error.message}` }, { status: 500 });
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

    // Delete record from Supabase
    const { error: dbError } = await supabaseAdmin
      .from('experiences')
      .delete()
      .eq('company', company.trim())
      .eq('period', period.trim());

    if (dbError) throw dbError;

    // Fetch updated list to return
    const { data: updatedDbData } = await supabaseAdmin
      .from('experiences')
      .select('*')
      .order('created_at', { ascending: true });

    // Format experiences back to { de: [], tr: [], en: [] } for frontend
    const deList: any[] = [];
    const trList: any[] = [];
    const enList: any[] = [];

    for (const item of updatedDbData || []) {
      deList.push({
        company: item.company,
        city: item.city,
        period: item.period,
        type: item.type,
        role: item.de?.role || '',
        tasks: item.de?.tasks || [],
        logo: item.logo_path || '',
        pdf: item.pdf_path || ''
      });
      trList.push({
        company: item.company,
        city: item.city,
        period: item.period,
        type: item.type,
        role: item.tr?.role || '',
        tasks: item.tr?.tasks || [],
        logo: item.logo_path || '',
        pdf: item.pdf_path || ''
      });
      enList.push({
        company: item.company,
        city: item.city,
        period: item.period,
        type: item.type,
        role: item.en?.role || '',
        tasks: item.en?.tasks || [],
        logo: item.logo_path || '',
        pdf: item.pdf_path || ''
      });
    }

    return NextResponse.json({
      success: true,
      data: { de: deList, tr: trList, en: enList }
    });
  } catch (error: any) {
    console.error('API DELETE Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
