import { SEED_REVIEWS, type Review } from "./data";

const REVIEW_KEY = "kishuka-reviews-v1";
const BOOKING_KEY = "kishuka-bookings-v1";
const REFERRAL_KEY = "kishuka-referrals-v1";

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function loadReviews(): Review[] {
  const extra = readJson<Review[]>(REVIEW_KEY, []);
  const ids = new Set(extra.map((r) => r.id));
  return [...extra, ...SEED_REVIEWS.filter((r) => !ids.has(r.id))];
}

export function saveReview(review: Review) {
  const extra = readJson<Review[]>(REVIEW_KEY, []);
  localStorage.setItem(REVIEW_KEY, JSON.stringify([review, ...extra]));
}

export type Booking = {
  id: string;
  name: string;
  phone: string;
  email: string;
  suburb: string;
  service: string;
  date: string;
  notes: string;
};

export function saveBooking(booking: Booking) {
  const all = readJson<Booking[]>(BOOKING_KEY, []);
  localStorage.setItem(BOOKING_KEY, JSON.stringify([booking, ...all]));
}

export type Referral = {
  id: string;
  code: string;
  yourName: string;
  yourPhone: string;
  friendName: string;
  friendPhone: string;
  suburb: string;
};

export function saveReferral(referral: Referral) {
  const all = readJson<Referral[]>(REFERRAL_KEY, []);
  localStorage.setItem(REFERRAL_KEY, JSON.stringify([referral, ...all]));
}

export function makeCode() {
  const n = crypto.randomUUID().slice(0, 4).toUpperCase();
  return `KISHU-${n}`;
}
