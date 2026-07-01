import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    // 1. Migrate Experiences
    const expJsonPath = path.join(process.cwd(), 'src', 'data', 'experiences.json');
    let experiencesData: any = { de: [], tr: [], en: [] };
    
    try {
      const expContent = await fs.readFile(expJsonPath, 'utf8');
      experiencesData = JSON.parse(expContent);
    } catch (e) {
      console.warn('experiences.json not found or empty during seeding.');
    }

    const deList = experiencesData.de || [];
    const trList = experiencesData.tr || [];
    const enList = experiencesData.en || [];

    const length = Math.max(deList.length, trList.length, enList.length);
    const experiencesToInsert = [];

    for (let i = 0; i < length; i++) {
      const deItem = deList[i] || {};
      const trItem = trList[i] || {};
      const enItem = enList[i] || {};

      experiencesToInsert.push({
        company: deItem.company || trItem.company || enItem.company || '',
        city: deItem.city || trItem.city || enItem.city || '',
        period: deItem.period || trItem.period || enItem.period || '',
        type: deItem.type || trItem.type || enItem.type || 'work',
        de: { role: deItem.role || '', tasks: deItem.tasks || [] },
        tr: { role: trItem.role || '', tasks: trItem.tasks || [] },
        en: { role: enItem.role || '', tasks: enItem.tasks || [] },
        logo_path: deItem.logo || trItem.logo || enItem.logo || '',
        pdf_path: deItem.pdf || trItem.pdf || enItem.pdf || ''
      });
    }

    if (experiencesToInsert.length > 0) {
      // Clear experiences first (avoid duplicates)
      const { error: delErr } = await supabaseAdmin.from('experiences').delete().neq('company', '---PLACEHOLDER---');
      if (delErr) console.warn('Failed clearing experiences:', delErr);
      
      const { error: expError } = await supabaseAdmin.from('experiences').insert(experiencesToInsert);
      if (expError) throw expError;
    }

    // 2. Migrate Documents
    const docJsonPath = path.join(process.cwd(), 'src', 'data', 'documents.json');
    let documentsData: any = { de: [], tr: [], en: [] };
    
    try {
      const docContent = await fs.readFile(docJsonPath, 'utf8');
      documentsData = JSON.parse(docContent);
    } catch (e) {
      console.warn('documents.json not found or empty during seeding.');
    }

    const docDeList = documentsData.de || [];
    const docTrList = documentsData.tr || [];
    const docEnList = documentsData.en || [];

    const docLength = Math.max(docDeList.length, docTrList.length, docEnList.length);
    const documentsToInsert = [];

    for (let i = 0; i < docLength; i++) {
      const deItem = docDeList[i] || {};
      const trItem = docTrList[i] || {};
      const enItem = docEnList[i] || {};

      documentsToInsert.push({
        de_term: deItem.term || '',
        tr_term: trItem.term || deItem.term || '',
        en_term: enItem.term || deItem.term || '',
        date: deItem.date || trItem.date || enItem.date || '',
        file_path: deItem.file || trItem.file || enItem.file || ''
      });
    }

    if (documentsToInsert.length > 0) {
      // Clear documents first
      const { error: delDocErr } = await supabaseAdmin.from('documents').delete().neq('de_term', '---PLACEHOLDER---');
      if (delDocErr) console.warn('Failed clearing documents:', delDocErr);
      
      const { error: docError } = await supabaseAdmin.from('documents').insert(documentsToInsert);
      if (docError) throw docError;
    }

    return NextResponse.json({
      success: true,
      message: `Supabase database seeded successfully! Migrated ${experiencesToInsert.length} experiences and ${documentsToInsert.length} documents.`,
    });
  } catch (err: any) {
    console.error('Migration seeding error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
