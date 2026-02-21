# Care Bridge Kenya — Production Implementation Plan
> **Goal:** Reach feature parity with GoFundMe, optimised for the Kenyan market.  
> **Stack:** Next.js 16 · Supabase (Postgres + Auth + Storage + Realtime) · Vercel

---

## ✅ COMPLETED (Pre-Plan)
- [x] Landing page with hero, featured campaigns, categories, how-it-works, trust section
- [x] Campaign detail page (static/mock data)
- [x] Multi-step campaign creation UI (Step 1-4 forms)
- [x] Auth modal (sign-up / sign-in via Supabase)
- [x] Dark mode theme (CSS variables)
- [x] Remove currency values from campaign cards on homepage
- [x] "See More" button on campaign cards → navigates to `/campaign/[slug]`
- [x] All "Start Campaign" buttons → navigate to `/campaign/create`

---

## STAGE 1 — Database Foundation & Real Data (Week 1)
> Connect everything to Supabase. Replace all mock data with live queries.

### 1.1 Supabase Schema (run in Supabase SQL Editor)
Tables to create / verify:
- `profiles` — extended user info (full_name, avatar_url, phone, id_number, is_verified, role)
- `campaigns` — title, slug, story, category, target_amount, current_amount, county, status, creator_id, deadline, is_urgent, view_count
- `campaign_images` — campaign_id, storage_url, order_index
- `campaign_documents` — campaign_id, storage_url, file_name, file_size, type (id/bank/proof)
- `donations` — campaign_id, donor_id (nullable for anon), amount, payment_method, payment_ref, message, is_anonymous, status (pending/confirmed/failed)
- `campaign_updates` — campaign_id, author_id, title, content, created_at
- `campaign_likes` / `campaign_shares` — tracking engagement

### 1.2 Row-Level Security (RLS) Policies
- Anyone can READ published campaigns
- Only authenticated creators can INSERT/UPDATE their own campaigns
- Donations writable by anyone (for anonymous donors)
- Profiles only readable/editable by their owner

### 1.3 Replace Mock Data with Live Queries
**Files to update:**
- `app/(main)/page.tsx` — fetch top 3 featured campaigns from Supabase
- `app/(main)/campaign/[slug]/page.tsx` — fetch campaign by slug, with images, updates, donations
- `app/(main)/explore/page.tsx` — paginated campaign list with filters

### 1.4 Supabase Storage Buckets
- `campaign-images` (public) — photos uploaded by campaign creators
- `campaign-documents` (private) — verification docs (ID, bank letter, etc.)
- `avatars` (public) — user profile pictures

**Deliverable:** Every page shows real data from Supabase or graceful empty states.

---

## STAGE 2 — Campaign Creation (Full Flow) (Week 1-2)
> Make the "Start Campaign" wizard actually save to Supabase with images and documents.

### 2.1 Step 1 — Basics (already has UI)
- Wire `submitCampaign()` in `campaign-context.tsx` to Supabase INSERT
- Auto-generate `slug` from title (slugify library or custom util)
- Save draft to `localStorage` so creators don't lose progress

### 2.2 Step 2 — Story (already has UI)
- Rich text editor for story (use `react-quill` or plain `<textarea>` with markdown preview)
- Upload campaign photos → Supabase Storage → insert URLs to `campaign_images`
- Support multiple images (up to 8), drag-and-drop reorder

### 2.3 Step 3 — Verification / Payment Info (NEEDS FULL REBUILD)
Current step-3 only collects basic docs. Needs to collect:

**Identity Verification:**
- National ID or Passport number (text field)
- Upload front + back of ID photo

**Payment Withdrawal Methods (choose one or more):**
- **M-Pesa Paybill** — Business number + Account number
- **M-Pesa Till Number** — Till number + Registered name
- **M-Pesa Personal (Safaricom)** — Phone number
- **Bank Account** — Bank name (select from list), Branch, Account Number, Account Name
- **PayPal** — PayPal email address

**Supporting Documents:**
- Proof of need (medical report, school fee invoice, community letter, etc.)
- File upload → Supabase Storage (private bucket)

### 2.4 Step 4 — Review & Submit
- Preview of all entered data
- Terms & Conditions checkbox
- Submit → sets `status = 'pending_review'` in DB
- Admin must approve before campaign goes `live`
- Send email confirmation to creator (Supabase Edge Function + Resend)

### 2.5 Campaign Context Updates (`context/campaign-context.tsx`)
Add to draft state:
```ts
idNumber: string
idDocUrls: string[]
paymentMethods: PaymentMethod[]
supportingDocUrls: string[]
```

**Deliverable:** Creator can complete all 4 steps, upload images + docs, and the campaign is saved to Supabase awaiting admin approval.

---

## STAGE 3 — Donation Flow (Week 2-3)
> The most critical feature — let users actually donate.

### 3.1 Donation Modal / Page
When user clicks "Donate Now" on a campaign detail page:
- Show modal or dedicated `/campaign/[slug]/donate` page
- Amount selection: preset amounts (KES 500, 1000, 2000, 5000) + custom input
- Anonymous donation toggle
- Optional encouraging message

### 3.2 Payment Gateway Integration

#### Option A: M-Pesa STK Push (Daraja API) — PRIMARY
- Safaricom Daraja API (M-Pesa Express/STK Push)
- Flow: User enters M-Pesa phone number → API sends push to their phone → they enter PIN
- Handle callback from Safaricom to confirm payment
- Requires: Safaricom Developer account + Business Shortcode (Paybill/Till)
- **Implementation:** Supabase Edge Function as the callback receiver

#### Option B: Card / Online Banking — Flutterwave or Paystack
- Both support Kenya (KES), cards, M-Pesa, bank transfers
- Flutterwave preferred for East Africa coverage
- Redirect or inline modal checkout
- Webhook to Supabase Edge Function for payment confirmation

#### Option C: Manual M-Pesa (fallback while Daraja is pending)
- Show campaign's M-Pesa details (from step 3)
- User sends money manually and uploads an M-Pesa confirmation screenshot
- Mark donation as `pending_verification`

### 3.3 Post-Payment
- On confirmed payment: `donations` row status → `confirmed`
- `campaigns.current_amount` incremented (via DB trigger or Edge Function)
- Donor gets email receipt (Edge Function)
- Campaign creator gets email notification
- Real-time progress bar update via Supabase Realtime

### 3.4 Anonymous vs Authenticated Donations
- Authenticated: donation linked to `donor_id`
- Anonymous: no `donor_id`, but still need an email for receipt

**Deliverable:** Users can donate via M-Pesa STK Push or Flutterwave card payment, and the campaign progress updates in real-time.

---

## STAGE 4 — Campaign Management Dashboard (Week 3)
> Give creators and donors a proper dashboard.

### 4.1 Creator Dashboard (`/dashboard`)
- My Campaigns list (with status badges: Draft / Pending Review / Live / Completed)
- Per-campaign stats: total raised, donor count, latest donations, shares
- Edit campaign (title, story, images — not the financial/verification info)
- Post a campaign update (notifies donors by email)
- Withdraw funds (request withdrawal — admin processes it)
- Delete / close a campaign

### 4.2 Donor Dashboard (same `/dashboard` for donors)
- Donations history (amount, campaign, date, payment method)
- Campaigns they follow / saved
- Download donation receipts (PDF)

### 4.3 Admin Panel (`/admin`) — separate protected route
- Review pending campaigns (approve / reject with reason)
- Flag suspicious campaigns
- Process withdrawal requests
- View platform-level stats (total raised, fees collected, etc.)

### 4.4 Campaign Updates (from creators)
- Creator posts update → shows in campaign detail "Updates" tab
- Supabase Realtime or email notification to donors

**Deliverable:** Creators can manage campaigns and donors can track their giving history.

---

## STAGE 5 — Trust, Verification & Social (Week 4)
> Build the trust mechanisms that make donors feel safe.

### 5.1 Campaign Verification Badges
- `is_verified` flag on campaigns (set by admin after reviewing docs)
- Show green verified badge on campaign card and detail page
- "Verified by Care Bridge Kenya" trust indicator

### 5.2 Identity Verification for Creators
- KYC (Know Your Customer) check using uploaded ID
- Phase 1: Manual admin review
- Phase 2 (future): Integration with a Kenyan KYC API (e.g., Smile Identity, Africa's Talking ID verification)

### 5.3 Sharing & Virality
- Share campaign via: WhatsApp deep link, Facebook, Twitter/X, copy link
- WhatsApp sharing is critical in Kenya — pre-populate message with campaign title + URL
- Track shares in `campaign_shares` table

### 5.4 Campaign Updates & Donor Engagement
- Creators can post progress updates
- Donors who gave get email notification for each update
- Comments / encouragements section (already partially built)

### 5.5 Reporting & Safety
- "Report Campaign" button on detail page
- Reason selection modal (fraud, misuse, etc.)
- Flagged campaigns visible to admin

### 5.6 SEO & Open Graph
- Dynamic OG image per campaign (campaign photo + title + progress)
- Next.js metadata API for each campaign page
- Sitemap generation for all live campaigns

**Deliverable:** Platform has trust signals, social sharing, and safety mechanisms.

---

## STAGE 6 — Production Polish & Deployment (Week 4-5)

### 6.1 Email Infrastructure (Resend + Supabase Edge Functions)
Transactional emails:
- Welcome email on sign-up
- Email verification
- Campaign submitted confirmation
- Campaign approved / rejected notification
- Donation received (to campaign creator)
- Donation receipt (to donor)
- Campaign update notification (to donors)
- Withdrawal request status

### 6.2 Performance & SEO
- All campaign list pages use Server Components (move away from `"use client"` where possible)
- Image optimization (Next.js `<Image>` with proper `sizes`)
- Lazy loading for off-screen content
- Add loading skeletons for data-fetching states

### 6.3 Error Handling & Empty States
- Every data-fetching route has error boundaries
- 404 page for unknown campaign slugs
- Graceful fallback if Supabase is slow

### 6.4 Environment Variables (Vercel)
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY (server-side only)
FLUTTERWAVE_SECRET_KEY
DARAJA_CONSUMER_KEY
DARAJA_CONSUMER_SECRET
DARAJA_SHORTCODE
DARAJA_PASSKEY
RESEND_API_KEY
NEXT_PUBLIC_APP_URL
```

### 6.5 Vercel Deployment Checklist
- [ ] All env vars set in Vercel dashboard
- [ ] Supabase RLS policies tested against production data
- [ ] Supabase Edge Functions deployed (payment callbacks, email triggers)
- [ ] Custom domain configured
- [ ] Analytics (Vercel Analytics or PostHog) enabled
- [ ] Error monitoring (Sentry) integrated

---

## Implementation Order (Step-by-Step Sequence)

| # | Task | Estimated Time |
|---|------|---------------|
| 1 | ✅ UI: Remove currency from cards, "See More" button, fix nav buttons | Done |
| 2 | DB: Create full Supabase schema + RLS policies | 2 hrs |
| 3 | DB: Connect homepage + explore to real Supabase data | 2 hrs |
| 4 | DB: Connect campaign detail page to real data | 2 hrs |
| 5 | Campaign Creation: Wire Step 1-2 to Supabase + image uploads | 4 hrs |
| 6 | Campaign Creation: Rebuild Step 3 with payment info collection | 4 hrs |
| 7 | Campaign Creation: Wire Step 4 submit + admin review flow | 2 hrs |
| 8 | Donation: Build donation modal UI | 2 hrs |
| 9 | Donation: Integrate Flutterwave (cards + M-Pesa redirect) | 4 hrs |
| 10 | Donation: M-Pesa STK Push (Daraja API) via Edge Function | 6 hrs |
| 11 | Dashboard: Creator dashboard (my campaigns, stats, updates) | 4 hrs |
| 12 | Dashboard: Admin panel (approve campaigns, process withdrawals) | 3 hrs |
| 13 | Email: Set up Resend + Edge Function triggers | 3 hrs |
| 14 | Trust: Verification badges, sharing, reporting | 2 hrs |
| 15 | SEO: Dynamic OG images, metadata, sitemap | 2 hrs |
| 16 | Production: Error handling, loading states, perf audit | 3 hrs |
| 17 | Deployment: Env vars on Vercel, Edge Functions, domain | 1 hr |

**Total estimated effort: ~50 hours of focused development**

---

## Notes on Kenya-Specific Requirements
- **Currency:** KES (Kenyan Shilling) as primary, USD as secondary
- **Payment Priority:** M-Pesa first (80%+ of Kenyans use it), cards second
- **Language:** English + Kiswahili support (future phase)
- **Mobile-first:** 70%+ of Kenyan internet users are on mobile
- **Offline resilience:** Show meaningful error messages when connectivity is poor
- **Daraja API:** Requires a registered Safaricom M-Pesa Business Shortcode — apply at developer.safaricom.co.ke
- **Flutterwave:** Supports KES, M-Pesa (redirect), Visa/Mastercard — fastest path to accepting payments
