import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function GET(req: Request) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const roleFilter = searchParams.get("role") || "";
    const tierFilter = searchParams.get("tier") || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") || "20")));

    const supabase = await createSupabaseServerClient();

    let query = supabase.from("profiles").select("*", { count: "exact" });

    if (search) {
      query = query.or(
        `display_name.ilike.%${search}%,email.ilike.%${search}%`
      );
    }

    if (roleFilter === "admin") {
      query = query.eq("is_admin", true);
    } else if (roleFilter === "user") {
      query = query.eq("is_admin", false);
    }

    if (tierFilter) {
      query = query.eq("tier", tierFilter);
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data: users, count, error } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    return NextResponse.json({
      users: users || [],
      total: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize),
    });
  } catch (error) {
    console.error("[AdminUsers] GET error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, is_admin, tier, is_premium, premium_expires_at, suspended, display_name } = body;

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();
    const updateData: Record<string, unknown> = {};

    if (is_admin !== undefined) updateData.is_admin = is_admin;
    if (tier !== undefined) updateData.tier = tier;
    if (is_premium !== undefined) updateData.is_premium = is_premium;
    if (premium_expires_at !== undefined) updateData.premium_expires_at = premium_expires_at;
    if (suspended !== undefined) updateData.suspended = suspended;
    if (display_name !== undefined) updateData.display_name = display_name;

    const { data, error } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ user: data });
  } catch (error) {
    console.error("[AdminUsers] PATCH error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();

    const { error } = await supabase.auth.admin.deleteUser(id);

    if (error) {
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ suspended: true })
        .eq("id", id);

      if (profileError) throw profileError;
      return NextResponse.json({ message: "User suspended (auth delete failed)" });
    }

    return NextResponse.json({ message: "User deleted" });
  } catch (error) {
    console.error("[AdminUsers] DELETE error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
