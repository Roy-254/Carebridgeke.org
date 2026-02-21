import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing donation id" }, { status: 400 });

    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return cookieStore.getAll(); },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        cookieStore.set(name, value, options)
                    );
                },
            },
        }
    );

    const { data, error } = await supabase
        .from("donations")
        .select("id, status, amount, currency, donor_name, campaign:campaigns(title, slug)")
        .eq("id", id)
        .single();

    if (error || !data) {
        return NextResponse.json({ status: "not_found" }, { status: 404 });
    }

    return NextResponse.json({
        status: data.status,
        amount: data.amount,
        currency: data.currency,
        donor_name: data.donor_name,
        campaign_title: (data.campaign as any)?.title,
        campaign_slug: (data.campaign as any)?.slug,
    });
}
