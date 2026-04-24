/**
 * Frontend mirror of the three default therapist profiles used for the fixed
 * booking flow. These objects keep the matches page, therapist details page,
 * and demo fallback state aligned even when the API is temporarily unavailable.
 */
export const DEFAULT_THERAPIST_PLANS = [
  { label: 'Pack of 1 session', sessionCount: 1, price: 500, mode: 'Online' },
  { label: 'Pack of 1 session', sessionCount: 1, price: 1000, mode: 'Offline' },
  { label: 'Pack of 2 sessions', sessionCount: 2, price: 900, mode: 'Online' },
  { label: 'Pack of 2 sessions', sessionCount: 2, price: 1850, mode: 'Offline' },
  { label: 'Pack of 3 sessions', sessionCount: 3, price: 1300, mode: 'Online' },
  { label: 'Pack of 3 sessions', sessionCount: 3, price: 2700, mode: 'Offline' },
  { label: 'Pack of 4 sessions', sessionCount: 4, price: 1700, mode: 'Online' },
  { label: 'Pack of 4 sessions', sessionCount: 4, price: 3600, mode: 'Offline' }
];

export const DEFAULT_THERAPISTS = [
  {
    _id: 'ns',
    id: 'ns',
    slug: 'ns',
    fullName: 'Niharika Singh',
    email: 'niharika@mindease.com',
    phone: '9876543210',
    avatarUrl: 'https://res.cloudinary.com/daegs95ds/image/upload/v1776018084/SIH_image_24_trnafw.png',
    therapistProfile: {
      firstName: 'Niharika',
      lastName: 'Singh',
      gender: 'Female',
      pronouns: 'SHE/HER',
      qualification: 'MSc in Clinical Psychology',
      experienceText: '1 year of experience',
      languages: ['Hindi', 'English'],
      specializations: ['Anxiety', 'Grief & Loss', 'Stress'],
      bio: "I've always been someone who listens with care. My sessions are meant to feel safe, respectful, and calm so students can open up without fear of judgment.",
      avatarUrl: 'https://res.cloudinary.com/daegs95ds/image/upload/v1776018084/SIH_image_24_trnafw.png',
      status: 'approved',
      consultationPlans: DEFAULT_THERAPIST_PLANS
    }
  },
  {
    _id: 'as',
    id: 'as',
    slug: 'as',
    fullName: 'Arjun Sharma',
    email: 'arjun@mindease.com',
    phone: '9876543211',
    avatarUrl: 'https://res.cloudinary.com/daegs95ds/image/upload/v1776018083/SIH_image_25_tztm83.png',
    therapistProfile: {
      firstName: 'Arjun',
      lastName: 'Sharma',
      gender: 'Male',
      pronouns: 'HE/HIM',
      qualification: 'MSc in Clinical Psychology',
      experienceText: '1 year of experience',
      languages: ['Hindi', 'English'],
      specializations: ['Anxiety', 'Depression', 'Stress'],
      bio: 'I believe therapy works best when people feel understood rather than judged. I focus on making conversations honest, simple, and supportive.',
      avatarUrl: 'https://res.cloudinary.com/daegs95ds/image/upload/v1776018083/SIH_image_25_tztm83.png',
      status: 'approved',
      consultationPlans: DEFAULT_THERAPIST_PLANS
    }
  },
  {
    _id: 'pc',
    id: 'pc',
    slug: 'pc',
    fullName: 'Priya Chauhan',
    email: 'priya@mindease.com',
    phone: '9876543212',
    avatarUrl: 'https://res.cloudinary.com/daegs95ds/image/upload/q_auto/f_auto/v1776018084/SIH_image_24_trnafw.png',
    therapistProfile: {
      firstName: 'Priya',
      lastName: 'Chauhan',
      gender: 'Female',
      pronouns: 'SHE/HER',
      qualification: 'MSc in Clinical Psychology',
      experienceText: '1 year of experience',
      languages: ['Hindi', 'English'],
      specializations: ['Trauma', 'Grief & Loss', 'Anxiety'],
      bio: 'I create a space where students can slow down, understand their feelings, and start healing one step at a time.',
      avatarUrl: 'https://res.cloudinary.com/daegs95ds/image/upload/q_auto/f_auto/v1776018084/SIH_image_24_trnafw.png',
      status: 'approved',
      consultationPlans: DEFAULT_THERAPIST_PLANS
    }
  }
];

/**
 * Returns the matching default therapist by either slug id or display name.
 */
export function findDefaultTherapist(id: string | null | undefined) {
  if (!id) {
    return null;
  }

  const match = DEFAULT_THERAPISTS.find((therapist) =>
    therapist._id === id ||
    therapist.id === id ||
    therapist.slug === id ||
    therapist.fullName.toLowerCase() === id.toLowerCase()
  );

  return match ? structuredClone(match) : null;
}
