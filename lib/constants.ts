/**
 * Campaign categories
 */
export const CAMPAIGN_CATEGORIES = {
    SCHOOL_FEES: "school_fees",
    MEDICAL: "medical",
    EMERGENCY: "emergency",
    COMMUNITY: "community",
    WOMEN_EMPOWERMENT: "women_empowerment",
    OTHER: "other",
} as const;

export type CampaignCategory = typeof CAMPAIGN_CATEGORIES[keyof typeof CAMPAIGN_CATEGORIES];

export const CATEGORY_LABELS: Record<CampaignCategory, string> = {
    school_fees: "School Fees",
    medical: "Medical",
    emergency: "Emergency",
    community: "Community",
    women_empowerment: "Women's Empowerment",
    other: "Other",
};

export const CATEGORY_COLORS: Record<CampaignCategory, string> = {
    school_fees: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    medical: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    emergency: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    community: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    women_empowerment: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
    other: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
};

/**
 * Campaign statuses
 */
export const CAMPAIGN_STATUS = {
    PENDING: "pending",
    ACTIVE: "active",
    COMPLETED: "completed",
    REJECTED: "rejected",
    CLOSED: "closed",
} as const;

export type CampaignStatus = typeof CAMPAIGN_STATUS[keyof typeof CAMPAIGN_STATUS];

/**
 * Kenyan counties
 */
export const KENYAN_COUNTIES = [
    "Mombasa", "Kwale", "Kilifi", "Tana River", "Lamu", "Taita-Taveta",
    "Garissa", "Wajir", "Mandera", "Marsabit", "Isiolo", "Meru",
    "Tharaka-Nithi", "Embu", "Kitui", "Machakos", "Makueni", "Nyandarua",
    "Nyeri", "Kirinyaga", "Murang'a", "Kiambu", "Turkana", "West Pokot",
    "Samburu", "Trans-Nzoia", "Uasin Gishu", "Elgeyo-Marakwet", "Nandi",
    "Baringo", "Laikipia", "Nakuru", "Narok", "Kajiado", "Kericho",
    "Bomet", "Kakamega", "Vihiga", "Bungoma", "Busia", "Siaya",
    "Kisumu", "Homa Bay", "Migori", "Kisii", "Nyamira", "Nairobi",
] as const;

export type KenyanCounty = typeof KENYAN_COUNTIES[number];

/**
 * Payment methods
 */
export const PAYMENT_METHODS = {
    MPESA: "mpesa",
    CARD: "card",
    PAYPAL: "paypal",
} as const;

export type PaymentMethod = typeof PAYMENT_METHODS[keyof typeof PAYMENT_METHODS];

/**
 * Donation amounts (suggested)
 */
export const SUGGESTED_DONATIONS = [99];

/**
 * Platform fee (5%)
 */
export const PLATFORM_FEE = 0.05;

/**
 * Minimum withdrawal amount
 */
export const MIN_WITHDRAWAL_AMOUNT = 500;

/**
 * Maximum images per campaign
 */
export const MAX_CAMPAIGN_IMAGES = 10;

/**
 * Maximum file size for images (5MB)
 */
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

/**
 * Maximum file size for documents (10MB)
 */
export const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024;

/**
 * Allowed image formats
 */
export const ALLOWED_IMAGE_FORMATS = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

/**
 * Allowed document formats
 */
export const ALLOWED_DOCUMENT_FORMATS = [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
];

/**
 * Pagination
 */
export const CAMPAIGNS_PER_PAGE = 12;
export const DONATIONS_PER_PAGE = 20;
export const COMMENTS_PER_PAGE = 10;

/**
 * App URLs
 */
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

/**
 * Social media links
 */
export const SOCIAL_LINKS = {
    facebook: "https://facebook.com/unitybridgekenya",
    twitter: "https://twitter.com/unitybridgekenya",
    instagram: "https://instagram.com/unitybridgekenya",
    whatsapp: "https://wa.me/254740797404",
};

/**
 * Contact information
 */
export const CONTACT_INFO = {
    email: "support@unitybridgeke.org",
    phone: "0740 797 404",
    address: "Nairobi, Kenya",
};

/**
 * Withdrawal methods
 */
export const WITHDRAWAL_METHODS = {
    MPESA: "mpesa",
    BANK: "bank",
} as const;

export type WithdrawalMethod = typeof WITHDRAWAL_METHODS[keyof typeof WITHDRAWAL_METHODS];

/**
 * Withdrawal statuses
 */
export const WITHDRAWAL_STATUS = {
    PENDING: "pending",
    PROCESSING: "processing",
    COMPLETED: "completed",
    REJECTED: "rejected",
} as const;

export type WithdrawalStatus = typeof WITHDRAWAL_STATUS[keyof typeof WITHDRAWAL_STATUS];

/**
 * Donation statuses
 */
export const DONATION_STATUS = {
    PENDING: "pending",
    COMPLETED: "completed",
    FAILED: "failed",
    REFUNDED: "refunded",
} as const;

export type DonationStatus = typeof DONATION_STATUS[keyof typeof DONATION_STATUS];

/**
 * Report reasons
 */
export const REPORT_REASONS = [
    "Fraudulent campaign",
    "Inappropriate content",
    "Misleading information",
    "Duplicate campaign",
    "Spam",
    "Other",
] as const;

export type ReportReason = typeof REPORT_REASONS[number];
