export type ServiceId =
  | "dog-walking"
  | "home-sitting"
  | "boarding"
  | "doggy-day-care"
  | "pet-taxi"
  | "grooming-referral";

export type PetType = "Dogs" | "Cats" | "Birds" | "Rabbits" | "Guinea Pigs";

export type Sitter = {
  username: string;
  name: string;
  location: string;
  image: string;
  coverImage: string;
  bio: string;
  services: ServiceId[];
  petTypes: PetType[];
  rating: number;
  reviewCount: number;
  price: number;
  priceLabel: string;
  experienceYears: number;
  certifications: string[];
  responseTime: string;
  availability: string[];
  unavailableDates: string[];
  reviews: Review[];
};

export type Review = {
  name: string;
  date: string;
  rating: number;
  comment: string;
  petName: string;
};

export type BookingRecord = {
  reference: string;
  service: ServiceId;
  sitterUsername: string;
  sitterName: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  petName: string;
  petSpecies: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  address?: string;
  status: "upcoming" | "active" | "past";
  createdAt: string;
};

export type CareUpdate = {
  id: string;
  bookingReference: string;
  message: string;
  photoUrl: string;
  createdAt: string;
};
