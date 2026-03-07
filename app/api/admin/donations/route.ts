import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ─── Auth helper ──────────────────────────────────────────────
async function requireAdmin() {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return cookieStore.getAll(); },
                setAll(cs) { cs.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); },
            },
        }
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (!profile || profile.role !== "admin") return null;
    return user;
}

// ─── GET  — list donations ────────────────────────────────────
export async function GET(req: NextRequest) {
    const user = await requireAdmin();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = req.nextUrl;
    const status = searchParams.get("status");      // "pending" | "confirmed" | "failed" | all
    const search = searchParams.get("search");      // code / email / phone
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const pageSize = 20;

    let query = supabaseAdmin
        .from("donations")
        .select(`
            id,
            confirmation_code,
            donor_name,
            donor_email,
            donor_phone,
            amount,
            currency,
            donation_type,
            project_category,
            status,
            fund_status,
            payment_method,
            mpesa_receipt_code,
            subscribe_updates,
            is_anonymous,
            message,
            created_at,
            completed_at,
            verified_at,
            admin_notes,
            campaign:campaigns(id, title, slug, category)
        `, { count: "exact" })
        .order("created_at", { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

    if (status && status !== "all") query = query.eq("status", status);
    if (search) {
        query = query.or(`confirmation_code.ilike.%${search}%,donor_email.ilike.%${search}%,donor_phone.ilike.%${search}%,donor_name.ilike.%${search}%`);
    }

    const { data, error, count } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ donations: data ?? [], total: count ?? 0, page, pageSize });
}

// ─── PATCH — mark as paid / update  ──────────────────────────
export async function PATCH(req: NextRequest) {
    const user = await requireAdmin();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id, action, mpesa_receipt_code, admin_notes } = await req.json();

    if (!id || !action) {
        return NextResponse.json({ error: "Missing id or action" }, { status: 400 });
    }

    if (action === "mark_paid") {
        // 1. Update donation to confirmed
        const { data: donation, error } = await supabaseAdmin
            .from("donations")
            .update({
                status: "confirmed",
                fund_status: "pending",
                mpesa_receipt_code: mpesa_receipt_code ?? null,
                admin_notes: admin_notes ?? null,
                completed_at: new Date().toISOString(),
                verified_at: new Date().toISOString(),
                verified_by: user.id,
                updated_at: new Date().toISOString(),
            })
            .eq("id", id)
            .select("*, campaign:campaigns(id, title, slug, current_amount)")
            .single();

        if (error || !donation) {
            return NextResponse.json({ error: error?.message ?? "Update failed" }, { status: 500 });
        }

        // 2. Increment campaign amount if linked
        if (donation.campaign_id) {
            supabaseAdmin
                .from("campaigns")
                .update({ current_amount: ((donation.campaign as any)?.current_amount ?? 0) + donation.amount })
                .eq("id", donation.campaign_id)
                .then(() => { }, console.error);
        }

        // 3. Send receipt email
        if (donation.donor_email) {
            const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
            fetch(`${appUrl}/api/email/receipt`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    to: donation.donor_email,
                    donor_name: donation.donor_name,
                    amount: donation.amount,
                    currency: donation.currency,
                    campaign_title: (donation.campaign as any)?.title ?? "General Fund",
                    campaign_slug: (donation.campaign as any)?.slug,
                    payment_ref: mpesa_receipt_code,
                    confirmation_code: donation.confirmation_code,
                }),
            }).catch(console.error);
        }

        return NextResponse.json({ success: true, donation });
    }

    if (action === "mark_failed") {
        const { error } = await supabaseAdmin
            .from("donations")
            .update({ status: "failed", admin_notes: admin_notes ?? null, updated_at: new Date().toISOString() })
            .eq("id", id);
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
