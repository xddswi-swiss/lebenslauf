import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const passcode = searchParams.get("passcode");
    const isAdmin = Boolean(
      process.env.ADMIN_PASSCODE && passcode === process.env.ADMIN_PASSCODE,
    );

    let query = supabaseAdmin
      .from("guestbook")
      .select("*")
      .order("created_at", { ascending: false });

    // If not admin, return only approved/visible posts
    if (!isAdmin) {
      query = query.eq("is_approved", true);
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error: any) {
    console.error("Error fetching guestbook entries:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, message } = body;

    if (!name || !name.trim() || !message || !message.trim()) {
      return NextResponse.json(
        { error: "Name and message are required" },
        { status: 400 },
      );
    }

    const { error } = await supabaseAdmin.from("guestbook").insert({
      name: name.trim(),
      message: message.trim(),
      is_approved: true, // Default to true, Eren can moderate/delete from panel
    });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error adding guestbook entry:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { passcode, id } = body;

    // Validate passcode against the server-only environment variable
    if (!process.env.ADMIN_PASSCODE || passcode !== process.env.ADMIN_PASSCODE) {
      return NextResponse.json(
        { error: "Falsches Passwort / Yanlış Şifre / Incorrect Password" },
        { status: 401 },
      );
    }

    if (!id) {
      return NextResponse.json({ error: "Missing entry ID" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("guestbook")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting guestbook entry:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
