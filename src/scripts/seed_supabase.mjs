import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';

async function main() {
  try {
    // Load env variables manually from .env.local
    let envContent = '';
    try {
      envContent = await fs.readFile('.env.local', 'utf8');
    } catch (e) {
      console.error("Could not read .env.local file");
      process.exit(1);
    }

    const env = {};
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const index = trimmed.indexOf('=');
      if (index !== -1) {
        const key = trimmed.substring(0, index).trim();
        const val = trimmed.substring(index + 1).trim();
        env[key] = val;
      }
    });

    const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
      process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      }
    });

    // === 1. SEED EXPERIENCES ===
    const jsonPath = path.join(process.cwd(), 'src', 'data', 'experiences.json');
    const rawData = await fs.readFile(jsonPath, 'utf8');
    const data = JSON.parse(rawData);

    const deItems = data.de || [];
    const trItems = data.tr || [];
    const enItems = data.en || [];

    console.log(`Found ${deItems.length} experiences to insert...`);

    // Clear existing records in Supabase
    console.log("Deleting existing experiences...");
    const { error: deleteError } = await supabase
      .from('experiences')
      .delete()
      .neq('company', 'DELETE_ALL_RECORDS'); // matches all rows

    if (deleteError) {
      console.error("Delete error:", deleteError);
      throw deleteError;
    }

    // Zip items and insert
    const insertData = deItems.map((deItem, i) => {
      const trItem = trItems[i] || deItem;
      const enItem = enItems[i] || deItem;

      return {
        company: deItem.company,
        city: deItem.city,
        period: deItem.period,
        type: deItem.type || 'work',
        de: { role: deItem.role, tasks: deItem.tasks },
        tr: { role: trItem.role, tasks: trItem.tasks },
        en: { role: enItem.role, tasks: enItem.tasks },
        logo_path: deItem.imageUrl || '',
        pdf_path: deItem.pdfReport || ''
      };
    });

    console.log("Inserting new experiences into Supabase...");
    const { error: insertError } = await supabase
      .from('experiences')
      .insert(insertData);

    if (insertError) {
      console.error("Insert error:", insertError);
      throw insertError;
    }

    console.log("Supabase experiences database populated successfully!");

    // === 2. SEED DOCUMENTS ===
    const docJsonPath = path.join(process.cwd(), 'src', 'data', 'documents.json');
    const rawDocData = await fs.readFile(docJsonPath, 'utf8');
    const docData = JSON.parse(rawDocData);

    const deDocs = docData.de || [];
    const trDocs = docData.tr || [];
    const enDocs = docData.en || [];

    console.log(`Found ${deDocs.length} documents to insert...`);

    console.log("Deleting existing documents...");
    const { error: deleteDocError } = await supabase
      .from('documents')
      .delete()
      .neq('de_term', 'DELETE_ALL_RECORDS');

    if (deleteDocError) {
      console.error("Delete doc error:", deleteDocError);
      throw deleteDocError;
    }

    const insertDocs = deDocs.map((deDoc, i) => {
      const trDoc = trDocs[i] || deDoc;
      const enDoc = enDocs[i] || deDoc;

      return {
        de_term: deDoc.term.trim(),
        tr_term: trDoc.term.trim(),
        en_term: enDoc.term.trim(),
        date: deDoc.date.trim(),
        file_path: deDoc.file
      };
    });

    console.log("Inserting new documents into Supabase...");
    const { error: insertDocError } = await supabase
      .from('documents')
      .insert(insertDocs);

    if (insertDocError) {
      console.error("Insert doc error:", insertDocError);
      throw insertDocError;
    }

    console.log("Supabase documents database populated successfully!");

  } catch (error) {
    console.error("Error seeding data:", error);
  }
}

main();
