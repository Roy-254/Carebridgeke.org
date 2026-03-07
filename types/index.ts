import { CampaignCategory, CampaignStatus, KenyanCounty, PaymentMethod, DonationStatus, WithdrawalMethod, WithdrawalStatus } from "@/lib/constants";

/**
 * Database Types
 * These types match the Supabase database schema
 */

export interface User {
    id: string;
    email: string;
    phone_number?: string;
    full_name: string;
    avatar_url?: string;
    bio?: string;
    county?: KenyanCounty;
    is_verified: boolean;
    verification_documents?: Record<string, any>;
    created_at: string;
    updated_at: string;
}

export interface Campaign {
    id: string;
    creator_id: string;
    title: string;
    slug: string;
    category: CampaignCategory;
    description?: string;
    target_amount: number;
    current_amount: number;
    currency: "KES" | "USD";
    story: string;
    images: string[];
    supporting_documents?: string[];
    beneficiary_info?: Record<string, any>;
    county?: KenyanCounty;
    deadline?: string;
    status: CampaignStatus;
    is_featured: boolean;
    is_urgent: boolean;
    verification_badge: boolean;
    view_count: number;
    created_at: string;
    updated_at: string;

    // Relations
    creator?: User;
    donations?: Donation[];
    updates?: CampaignUpdate[];
    comments?: Comment[];
}

export interface Donation {
    id: string;
    campaign_id: string;
    donor_id?: string;
    donor_name?: string;
    donor_email?: string;
    amount: number;
    currency: "KES" | "USD";
    payment_method: PaymentMethod;
    transaction_id: string;
    is_anonymous: boolean;
    message?: string;
    status: DonationStatus;
    created_at: string;

    // Relations
    campaign?: Campaign;
    donor?: User;
}

export interface CampaignUpdate {
    id: string;
    campaign_id: string;
    title: string;
    content: string;
    images?: string[];
    created_at: string;

    // Relations
    campaign?: Campaign;
}

export interface Comment {
    id: string;
    campaign_id: string;
    user_id: string;
    content: string;
    created_at: string;

    // Relations
    campaign?: Campaign;
    user?: User;
}

export interface Withdrawal {
    id: string;
    campaign_id: string;
    user_id: string;
    amount: number;
    withdrawal_method: WithdrawalMethod;
    account_details: Record<string, any>;
    status: WithdrawalStatus;
    processed_at?: string;
    created_at: string;

    // Relations
    campaign?: Campaign;
    user?: User;
}

export interface Report {
    id: string;
    campaign_id: string;
    reporter_id?: string;
    reason: string;
    description?: string;
    status: "pending" | "reviewed" | "resolved";
    created_at: string;

    // Relations
    campaign?: Campaign;
    reporter?: User;
}

export interface Favorite {
    id: string;
    user_id: string;
    campaign_id: string;
    created_at: string;

    // Relations
    user?: User;
    campaign?: Campaign;
}

/**
 * API Response Types
 */

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

/**
 * Form Types
 */

export interface CreateCampaignInput {
    title: string;
    category: CampaignCategory;
    target_amount: number;
    story: string;
    images: File[];
    supporting_documents?: File[];
    beneficiary_info?: {
        name: string;
        relationship: string;
        contact?: string;
    };
    county?: KenyanCounty;
    deadline?: Date;
}

export interface DonationInput {
    campaign_id: string;
    amount: number;
    payment_method: PaymentMethod;
    is_anonymous: boolean;
    message?: string;
    donor_name?: string;
    donor_email?: string;
}

export interface WithdrawalInput {
    campaign_id: string;
    amount: number;
    withdrawal_method: WithdrawalMethod;
    account_details: {
        mpesa_number?: string;
        bank_name?: string;
        account_number?: string;
        account_name?: string;
    };
}

/**
 * Filter Types
 */

export interface CampaignFilters {
    category?: CampaignCategory;
    county?: KenyanCounty;
    status?: CampaignStatus;
    search?: string;
    sortBy?: "recent" | "popular" | "ending_soon" | "nearly_funded";
    page?: number;
    pageSize?: number;
}

/**
 * Statistics Types
 */

export interface PlatformStats {
    totalRaised: number;
    activeCampaigns: number;
    totalDonors: number;
    livesImpacted: number;
    successRate: number;
}

export interface CampaignStats {
    totalDonations: number;
    uniqueDonors: number;
    averageDonation: number;
    percentageFunded: number;
    daysRemaining?: number;
    recentDonations: Donation[];
}

export interface UserStats {
    totalDonated: number;
    campaignsSupported: number;
    campaignsCreated: number;
    activeCampaigns: number;
}

/**
 * Payment Types
 */

export interface MPesaSTKPushRequest {
    phoneNumber: string;
    amount: number;
    accountReference: string;
    transactionDesc: string;
}

export interface MPesaSTKPushResponse {
    MerchantRequestID: string;
    CheckoutRequestID: string;
    ResponseCode: string;
    ResponseDescription: string;
    CustomerMessage: string;
}

export interface MPesaCallbackResponse {
    Body: {
        stkCallback: {
            MerchantRequestID: string;
            CheckoutRequestID: string;
            ResultCode: number;
            ResultDesc: string;
            CallbackMetadata?: {
                Item: Array<{
                    Name: string;
                    Value: string | number;
                }>;
            };
        };
    };
}

export interface StripePaymentIntent {
    id: string;
    amount: number;
    currency: string;
    status: string;
    client_secret: string;
}

/**
 * Notification Types
 */

export interface Notification {
    id: string;
    user_id: string;
    type: "donation" | "campaign_update" | "withdrawal" | "milestone" | "comment";
    title: string;
    message: string;
    data?: Record<string, any>;
    read: boolean;
    created_at: string;
}

/**
 * Search Types
 */

export interface SearchResult {
    campaigns: Campaign[];
    users: User[];
    total: number;
}
