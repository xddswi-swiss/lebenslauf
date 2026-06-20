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

    if (!company || !city || !period || !deRole) {
      return NextResponse.json({ error: 'Fehlende Felder / Eksik alanlar / Missing required fields (Company, City, Period and at least one Role/Tasks are required)' }, { status: 400 });
    }

    const slug = slugify(company);
    let pdfPath = '';
    let logoPath = '';
    let readOnly = false;
    let writeErrors: string[] = [];

    // 1. Process Logo File if uploaded
    if (logoFile && logoFile.base64 && logoFile.name) {
      try {
        const logoExt = path.extname(logoFile.name) || '.png';
        const logoFileName = `${slug}${logoExt}`;
        logoPath = `/assets/bilder/${logoFileName}`;
        
        let base64Data = logoFile.base64;
        if (base64Data.includes(';base64,')) {
          base64Data = base64Data.split(';base64,')[1];
        }
        const buffer = Buffer.from(base64Data, 'base64');
        
        const bilderDir = path.join(process.cwd(), 'public', 'assets', 'bilder');
        await fs.mkdir(bilderDir, { recursive: true });
        const logoFullPath = path.join(bilderDir, logoFileName);
        await fs.writeFile(logoFullPath, buffer);
      } catch (err: any) {
        console.error('Error writing logo image:', err);
        writeErrors.push(`Logo image save failed: ${err.message}`);
        readOnly = true;
      }
    }

    // 2. Process PDF Report File if uploaded
    if (pdfFile && pdfFile.base64 && pdfFile.name) {
      try {
        const pdfFileName = `${slug}.pdf`;
        pdfPath = `/assets/pdfs/${pdfFileName}`;
        
        let base64Data = pdfFile.base64;
        if (base64Data.includes(';base64,')) {
          base64Data = base64Data.split(';base64,')[1];
        }
        const buffer = Buffer.from(base64Data, 'base64');
        
        const pdfsDir = path.join(process.cwd(), 'public', 'assets', 'pdfs');
        await fs.mkdir(pdfsDir, { recursive: true });
        const pdfFullPath = path.join(pdfsDir, pdfFileName);
        await fs.writeFile(pdfFullPath, buffer);
      } catch (err: any) {
        console.error('Error writing PDF report:', err);
        writeErrors.push(`PDF report save failed: ${err.message}`);
        readOnly = true;
      }
    }

    // 3. Create the new experience entries
    const newExperience = {
      de: {
        type,
        period,
        role: deRole,
        company,
        city,
        tasks: deTasks,
        ...(pdfPath && { pdfReport: pdfPath }),
        ...(logoPath && { imageUrl: logoPath })
      },
      tr: {
        type,
        period,
        role: trRole,
        company,
        city,
        tasks: trTasks,
        ...(pdfPath && { pdfReport: pdfPath }),
        ...(logoPath && { imageUrl: logoPath })
      },
      en: {
        type,
        period,
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

    try {
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

      if (!readOnly) {
        await fs.writeFile(jsonPath, JSON.stringify(updatedData, null, 2), 'utf8');
      }
    } catch (err: any) {
      console.error('Error writing experiences.json:', err);
      writeErrors.push(`JSON write failed: ${err.message}`);
      readOnly = true;
    }

    if (readOnly) {
      // Return readOnly flag along with the formatted JSON for fallback copy-paste
      return NextResponse.json({
        success: false,
        readOnly: true,
        message: 'Hosting environment is read-only (e.g. Serverless). JSON was generated but not saved.',
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

    // Filter out the item to delete
    const filterFn = (item: any) => {
      return !(item.company.toLowerCase().trim() === company.toLowerCase().trim() && item.period === period);
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
      return NextResponse.json({
        success: false,
        readOnly: true,
        message: 'Hosting environment is read-only. JSON was generated but not saved.',
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
