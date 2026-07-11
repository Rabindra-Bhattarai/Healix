export interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  bloodType: string;
  allergies: string;
  chronicConditions: string;
}

export const INITIAL_PROFILE: ProfileData = {
  fullName: "Alex Rivers",
  email: "alex.rivers@healix.com",
  phone: "+1 (555) 234-5678",
  address: "782 Mission Heights Blvd, Apt 4C, San Francisco, CA 94105",
  bloodType: "A+",
  allergies: "Penicillin, Seasonal Pollen",
  chronicConditions: "",
};
