/**
 * Central source for the three default therapists used across the project.
 *
 * Keeping this data in one file ensures the seed logic, public therapist list,
 * and therapist detail pages all stay aligned to the same profiles.
 */
const SEEDED_PLANS = [
  { label: 'Pack of 1 session', sessionCount: 1, price: 500, mode: 'Online' },
  { label: 'Pack of 1 session', sessionCount: 1, price: 1000, mode: 'Offline' },
  { label: 'Pack of 2 sessions', sessionCount: 2, price: 900, mode: 'Online' },
  { label: 'Pack of 2 sessions', sessionCount: 2, price: 1850, mode: 'Offline' },
  { label: 'Pack of 3 sessions', sessionCount: 3, price: 1300, mode: 'Online' },
  { label: 'Pack of 3 sessions', sessionCount: 3, price: 2700, mode: 'Offline' },
  { label: 'Pack of 4 sessions', sessionCount: 4, price: 1700, mode: 'Online' },
  { label: 'Pack of 4 sessions', sessionCount: 4, price: 3600, mode: 'Offline' }
];

const DEFAULT_THERAPISTS = [
  {
    slug: 'ns',
    fullName: 'Niharika Singh',
    email: 'niharika@mindease.com',
    phone: '9876543210',
    password: 'Therapist@123',
    avatarUrl: 'https://res.cloudinary.com/daegs95ds/image/upload/v1776018084/SIH_image_24_trnafw.png',
    therapistProfile: {
      firstName: 'Niharika',
      lastName: 'Singh',
      gender: 'Female',
      pronouns: 'SHE/HER',
      qualification: 'MSc in Clinical Psychology',
      yearsOfExperience: 1,
      experienceText: '1 year of experience',
      languages: ['Hindi', 'English'],
      specializations: ['Anxiety', 'Grief & Loss', 'Stress'],
      bio: "I've always been someone who listens with care. My sessions are meant to feel safe, respectful, and calm so students can open up without fear of judgment.",
      avatarUrl: 'https://res.cloudinary.com/daegs95ds/image/upload/v1776018084/SIH_image_24_trnafw.png',
      status: 'approved',
      consultationPlans: SEEDED_PLANS
    }
  },
  {
    slug: 'as',
    fullName: 'Arjun Sharma',
    email: 'arjun@mindease.com',
    phone: '9876543211',
    password: 'Therapist@123',
    avatarUrl: 'https://res.cloudinary.com/daegs95ds/image/upload/v1776018083/SIH_image_25_tztm83.png',
    therapistProfile: {
      firstName: 'Arjun',
      lastName: 'Sharma',
      gender: 'Male',
      pronouns: 'HE/HIM',
      qualification: 'MSc in Clinical Psychology',
      yearsOfExperience: 1,
      experienceText: '1 year of experience',
      languages: ['Hindi', 'English'],
      specializations: ['Anxiety', 'Depression', 'Stress'],
      bio: 'I believe therapy works best when people feel understood rather than judged. I focus on making conversations honest, simple, and supportive.',
      avatarUrl: 'https://res.cloudinary.com/daegs95ds/image/upload/v1776018083/SIH_image_25_tztm83.png',
      status: 'approved',
      consultationPlans: SEEDED_PLANS
    }
  },
  {
    slug: 'pc',
    fullName: 'Priya Chauhan',
    email: 'priya@mindease.com',
    phone: '9876543212',
    password: 'Therapist@123',
    avatarUrl: 'https://res.cloudinary.com/daegs95ds/image/upload/q_auto/f_auto/v1776018084/SIH_image_24_trnafw.png',
    therapistProfile: {
      firstName: 'Priya',
      lastName: 'Chauhan',
      gender: 'Female',
      pronouns: 'SHE/HER',
      qualification: 'MSc in Clinical Psychology',
      yearsOfExperience: 1,
      experienceText: '1 year of experience',
      languages: ['Hindi', 'English'],
      specializations: ['Trauma', 'Grief & Loss', 'Anxiety'],
      bio: 'I create a space where students can slow down, understand their feelings, and start healing one step at a time.',
      avatarUrl: 'https://res.cloudinary.com/daegs95ds/image/upload/q_auto/f_auto/v1776018084/SIH_image_24_trnafw.png',
      status: 'approved',
      consultationPlans: SEEDED_PLANS
    }
  }
];

const DEFAULT_THERAPIST_EMAILS = DEFAULT_THERAPISTS.map((therapist) => therapist.email);
const DEFAULT_THERAPIST_SLUGS = DEFAULT_THERAPISTS.map((therapist) => therapist.slug);
const DEFAULT_THERAPIST_BY_SLUG = new Map(DEFAULT_THERAPISTS.map((therapist) => [therapist.slug, therapist]));

module.exports = {
  SEEDED_PLANS,
  DEFAULT_THERAPISTS,
  DEFAULT_THERAPIST_EMAILS,
  DEFAULT_THERAPIST_SLUGS,
  DEFAULT_THERAPIST_BY_SLUG
};
