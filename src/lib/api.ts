// Types for API responses
export interface SiteSettings {
  id: number;
  logo: string | null;
  primaryColor: string;
  secondaryColor: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  socialLinks: Record<string, string>;
  orgRegistrationNo: string | null;
  trust12A: string | null;
  trust80G: string | null;
  footerTagline: string | null;
  presetAmounts: number[];
  tipPercentOptions: number[];
}

export interface FooterLink {
  id: number;
  section: string;
  label: string;
  url: string;
  order: number;
}

export interface SEOMeta {
  id: number;
  page: string;
  title: string;
  description: string;
  keywords: string | null;
}

export interface HeroSlide {
  id: number;
  image: string;
  headline: string;
  subtext: string | null;
  ctaText: string | null;
  ctaLink: string | null;
  order: number;
}

export interface InitiativeFeature {
  label: string;
  description: string;
}

export interface Initiative {
  id: number;
  title: string;
  slug: string;
  shortDesc: string;
  fullDesc: string;
  coverImage: string;
  featureImage: string | null;
  keyFeatures: InitiativeFeature[];
  keyActivities: string[];
  howItWorks: InitiativeFeature[];
  impactNumbers: Array<{ label: string; value: number }>;
  impactPoints: string[];
  order: number;
  photos?: InitiativePhoto[];
  videos?: InitiativeVideo[];
}

export interface InitiativePhoto {
  id: number;
  image: string;
  caption: string | null;
  order: number;
}

export interface InitiativeVideo {
  id: number;
  title: string;
  youtubeUrl: string;
  order: number;
}

export interface CampaignCostItem {
  item: string;
  qty: number;
  pricePerUnit: number;
}

export interface CampaignDonationEntry {
  donorName: string;
  amount: number;
  createdAt: string;
}

export interface CampaignCategory {
  id: number;
  name: string;
  slug: string;
  order: number;
}

export interface CampaignVideo {
  id: number;
  videoUrl: string;
  title: string | null;
  order: number;
}

export interface CampaignProduct {
  id: number;
  name: string;
  image: string;
  pricePerUnit: number;
  availableQty: number;
  order: number;
}

export interface Campaign {
  id: number;
  title: string;
  slug: string;
  summary: string;
  story: string;
  coverImage: string;
  goalAmount: number;
  raisedAmount: number;
  costBreakdown: CampaignCostItem[];
  status: 'ACTIVE' | 'COMPLETED';
  videoUrl: string | null;
  category: CampaignCategory | null;
  order: number;
  backersCount: number;
  recentDonations?: CampaignDonationEntry[];
  tipPercentOptions?: number[];
  presetAmounts?: number[];
  photos?: CampaignPhoto[];
  videos?: CampaignVideo[];
  products?: CampaignProduct[];
}

export interface CampaignPhoto {
  id: number;
  image: string;
  caption: string | null;
  order: number;
}

export interface Update {
  id: number;
  title: string;
  slug: string;
  category: string;
  coverImage: string;
  content: string;
  publishedAt: string;
}

export interface TeamMember {
  id: number;
  name: string;
  photo: string;
  designation: string;
  category: 'TRUSTEE' | 'CORE_TEAM' | 'VOLUNTEER';
  education: string | null;
  experience: string | null;
  linkedinUrl: string | null;
  order: number;
}

export interface GalleryAlbum {
  id: number;
  title: string;
  coverImage: string;
  eventDate: string | null;
  photos?: GalleryPhoto[];
}

export interface GalleryPhoto {
  id: number;
  image: string;
  caption: string | null;
  order: number;
}

export interface GalleryVideo {
  id: number;
  title: string;
  youtubeUrl: string;
  thumbnail: string | null;
}

export interface Testimonial {
  id: number;
  name: string;
  designation: string | null;
  photo: string | null;
  quote: string;
  order: number;
}

export interface ImpactCounter {
  id: number;
  label: string;
  number: number;
  icon: string | null;
  order: number;
}

export interface Partner {
  id: number;
  name: string;
  logo: string;
  websiteUrl: string | null;
  order: number;
}

export interface PolicyPage {
  id: number;
  type: 'PRIVACY' | 'TERMS';
  content: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

// API Client
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Backend origin (no /api suffix), for resolving relative media URLs like /uploads/xxx.png
export const API_ORIGIN = API_URL.replace(/\/api\/?$/, '');

// Prefixes a relative backend path (e.g. Media.url) with the backend origin.
// Leaves already-absolute URLs untouched.
export function resolveMediaUrl(url: string): string {
  if (/^https?:\/\//.test(url)) return url;
  return `${API_ORIGIN}${url}`;
}

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  const res = await fetch(url, {
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}

// Settings
export async function getSettings() {
  return fetchAPI<SiteSettings>('/settings');
}

// Footer Links
export async function getFooterLinks() {
  return fetchAPI<FooterLink[]>('/footer-links');
}

// Mission Quotes
export interface Quote {
  id: number;
  text: string;
  order: number;
}

export async function getQuotes() {
  return fetchAPI<Quote[]>('/quotes');
}

// Generic homepage content key/value store (Get Involved banner, Mission section)
export async function getSiteConfig() {
  return fetchAPI<Record<string, string>>('/site-config');
}

// Working Locations / Presence Map pins
export interface PresenceLocation {
  id: number;
  name: string;
  left: string;
  top: string;
  order: number;
}

export async function getPresenceLocations() {
  return fetchAPI<PresenceLocation[]>('/presence-locations');
}

// About Us page "Our Core Values" tiles
export interface CoreValue {
  id: number;
  title: string;
  description: string;
  order: number;
}

export async function getCoreValues() {
  return fetchAPI<CoreValue[]>('/core-values');
}

// SEO
export async function getSEOMeta(page: string) {
  return fetchAPI<SEOMeta>(`/seo/${page}`);
}

// Hero Slides
export async function getHeroSlides() {
  return fetchAPI<HeroSlide[]>('/hero-slides');
}

// Initiatives
export async function getInitiatives() {
  return fetchAPI<Initiative[]>('/initiatives');
}

export async function getInitiativeBySlug(slug: string) {
  return fetchAPI<Initiative>(`/initiatives/${slug}`);
}

// Campaigns
export async function getCampaigns(category?: string) {
  const params = category ? `?category=${encodeURIComponent(category)}` : '';
  return fetchAPI<Campaign[]>(`/campaigns${params}`);
}

export async function getCampaignBySlug(slug: string) {
  return fetchAPI<Campaign>(`/campaigns/${slug}`);
}

export async function getCampaignCategories() {
  return fetchAPI<CampaignCategory[]>('/campaign-categories');
}

// Updates
export async function getUpdates(category?: string, limit = 10, offset = 0) {
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  params.append('limit', limit.toString());
  params.append('offset', offset.toString());

  return fetchAPI<PaginatedResponse<Update>>(`/updates?${params.toString()}`);
}

export async function getUpdateBySlug(slug: string) {
  return fetchAPI<Update>(`/updates/${slug}`);
}

// Team
export async function getTeam() {
  return fetchAPI<Record<string, TeamMember[]>>('/team');
}

// Gallery
export async function getGalleryAlbums() {
  return fetchAPI<GalleryAlbum[]>('/gallery/albums');
}

export async function getGalleryAlbumById(id: number) {
  return fetchAPI<GalleryAlbum>(`/gallery/albums/${id}`);
}

export async function getGalleryVideos() {
  return fetchAPI<GalleryVideo[]>('/gallery/videos');
}

// Testimonials
export async function getTestimonials() {
  return fetchAPI<Testimonial[]>('/testimonials');
}

// Impact Counters
export async function getImpactCounters() {
  return fetchAPI<ImpactCounter[]>('/impact-counters');
}

// Partners
export async function getPartners() {
  return fetchAPI<Partner[]>('/partners');
}

// Policies
export async function getPolicyPage(type: 'PRIVACY' | 'TERMS') {
  return fetchAPI<PolicyPage>(`/policies/${type}`);
}

// Form submissions
export interface DonationItemRequest {
  productId: number;
  quantity: number;
}

export interface DonationRequest {
  donorName: string;
  email: string;
  phone?: string;
  address?: string;
  pan?: string;
  mode?: 'CASH' | 'PRODUCTS';
  amount?: number;
  tipAmount?: number;
  items?: DonationItemRequest[];
  donationType: 'ONE_TIME' | 'MONTHLY';
  campaignId?: number;
  paymentMethod: string;
}

export interface SubmitDonationResponse {
  success: boolean;
  donation: { id: number };
  razorpay: {
    orderId: string;
    amount: number; // paise
    currency: string;
    keyId: string;
  };
}

export async function submitDonation(data: DonationRequest) {
  return fetchAPI<SubmitDonationResponse>('/donations', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export interface VerifyDonationRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export async function verifyDonation(donationId: number, data: VerifyDonationRequest) {
  return fetchAPI<{ success: boolean; receiptUrl: string | null }>(`/donations/verify/${donationId}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export interface VolunteerRequest {
  fullName: string;
  email: string;
  phone: string;
  city?: string;
  age?: number;
  occupation?: string;
  skills?: string;
  areaOfInterest?: string;
  availability?: string;
  message?: string;
}

export async function submitVolunteer(data: VolunteerRequest) {
  return fetchAPI('/volunteers', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export interface ContactRequest {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export async function submitContact(data: ContactRequest) {
  return fetchAPI('/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export interface PartnerApplicationRequest {
  organization: string;
  contactName: string;
  email: string;
  phone: string;
  website?: string;
  partnershipType?: string;
  message?: string;
}

export async function submitPartnerApplication(data: PartnerApplicationRequest) {
  return fetchAPI('/partner-applications', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export interface InternshipApplicationRequest {
  fullName: string;
  email: string;
  phone: string;
  city?: string;
  education?: string;
  areaOfInterest?: string;
  availability?: string;
  message?: string;
}

export async function submitInternship(data: InternshipApplicationRequest) {
  return fetchAPI('/internships', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Admin-managed form fields (Partner / Internship / CV Building) — see FormField
// on the backend. Lets an admin add/edit/delete/reorder fields without a deploy.
export interface DynamicFormField {
  id: number;
  formType: 'PARTNER' | 'INTERNSHIP' | 'CV_BUILDING';
  label: string;
  fieldKey: string;
  fieldType: 'TEXT' | 'EMAIL' | 'PHONE' | 'TEXTAREA' | 'SELECT' | 'NUMBER';
  placeholder: string | null;
  required: boolean;
  options: string[] | null;
  order: number;
}

export async function getFormFields(formType: 'PARTNER' | 'INTERNSHIP' | 'CV_BUILDING') {
  return fetchAPI<DynamicFormField[]>(`/form-fields?formType=${formType}`);
}

// Loosely-typed submit helpers for the dynamic forms — the field set is
// admin-defined, so the payload shape isn't known at compile time.
export async function submitPartnerApplicationDynamic(data: Record<string, string>) {
  return fetchAPI('/partner-applications', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function submitInternshipDynamic(data: Record<string, string>) {
  return fetchAPI('/internships', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function submitCvRequest(data: Record<string, string>) {
  return fetchAPI('/cv-requests', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  order: number;
}

export async function getFaqs(): Promise<FAQ[]> {
  return fetchAPI('/faqs');
}

// Media (attached to a Blog or CampLocation)
export interface Media {
  id: number;
  type: 'IMAGE' | 'VIDEO';
  url: string | null;
  mimeType: string | null;
  caption: string | null;
  order: number;
}

// Blog
export interface Blog {
  id: number;
  title: string;
  slug: string;
  category: string;
  coverImage: string;
  content: string;
  publishedAt: string;
  media?: Media[];
}

export async function getBlogs(category?: string) {
  const params = category ? `?category=${encodeURIComponent(category)}` : '';
  return fetchAPI<Blog[]>(`/blogs${params}`);
}

export async function getBlogBySlug(slug: string) {
  return fetchAPI<Blog>(`/blogs/${slug}`);
}

// Camp Locations
export interface CampLocation {
  id: number;
  initiativeId: number;
  name: string;
  address: string;
  city: string | null;
  state: string | null;
  latitude: number | null;
  longitude: number | null;
  campDate: string | null;
  description: string | null;
  order: number;
  media?: Media[];
}

export async function getCampLocations(params?: { initiativeId?: number }) {
  const query = params?.initiativeId ? `?initiativeId=${params.initiativeId}` : '';
  return fetchAPI<CampLocation[]>(`/camp-locations${query}`);
}
