import type { CareUpdate, PetType, ServiceId, Sitter } from "@/lib/types";

export const services: Array<{
  id: ServiceId;
  name: string;
  shortName: string;
  price: string;
  description: string;
  duration?: string;
}> = [
  {
    id: "dog-walking",
    name: "Dog Walking",
    shortName: "Dog walking",
    price: "From KSh 700",
    description: "A cheerful local walk with water breaks and a photo update.",
    duration: "30 min or 60 min"
  },
  {
    id: "home-sitting",
    name: "Pet Sitting at Your Home",
    shortName: "Home sitting",
    price: "From KSh 1,800",
    description: "Gentle, familiar care while you are away from home."
  },
  {
    id: "boarding",
    name: "Boarding at Sitter's Home",
    shortName: "Boarding",
    price: "From KSh 2,200",
    description: "A safe overnight stay with a trusted pet lover."
  },
  {
    id: "doggy-day-care",
    name: "Doggy Day Care",
    shortName: "Day care",
    price: "From KSh 1,500",
    description: "A playful daytime routine with rest, meals and companionship."
  },
  {
    id: "pet-taxi",
    name: "Pet Taxi",
    shortName: "Pet taxi",
    price: "From KSh 900",
    description: "Comfortable, caring transport for vet visits and more."
  },
  {
    id: "grooming-referral",
    name: "Grooming Referral",
    shortName: "Grooming",
    price: "From KSh 1,200",
    description: "A vetted local groomer for a fresh, comfortable pet."
  }
];

export const neighbourhoods = ["Karen", "Kilimani", "Westlands", "Lavington", "Runda", "Kileleshwa"];
export const petTypes: PetType[] = ["Dogs", "Cats", "Birds", "Rabbits", "Guinea Pigs"];

export const sitters: Sitter[] = [
  {
    username: "wambui-wanjiku",
    name: "Wambui Wanjiku",
    location: "Kilimani, Nairobi",
    image: "/images/sitter-wambui.jpg",
    coverImage: "/images/hero-pet-owner.jpg",
    bio: "I am a patient animal lover and dog mum who knows that calm routines make happy pets. I give every walk, meal and cuddle my full attention.",
    services: ["dog-walking", "home-sitting", "doggy-day-care"],
    petTypes: ["Dogs", "Cats", "Rabbits"],
    rating: 4.9,
    reviewCount: 47,
    price: 850,
    priceLabel: "KSh 850 per hour",
    experienceYears: 5,
    certifications: ["Pet first aid", "Background checked", "Fear free handling"],
    responseTime: "Usually replies in 15 minutes",
    availability: ["2026-10-23", "2026-10-24", "2026-10-26", "2026-10-28", "2026-10-29", "2026-10-30"],
    unavailableDates: ["2026-10-25", "2026-10-27", "2026-10-31"],
    reviews: [
      { name: "Aisha M.", date: "October 2026", rating: 5, comment: "Wambui was lovely with Milo and sent the sweetest walk photos.", petName: "Milo" },
      { name: "Daniel K.", date: "September 2026", rating: 5, comment: "Clear communication, punctual and very calm with our rescue dog.", petName: "Kito" }
    ]
  },
  {
    username: "brian-otieno",
    name: "Brian Otieno",
    location: "Westlands, Nairobi",
    image: "/images/sitter-brian.jpg",
    coverImage: "/images/dog-walk.jpg",
    bio: "Long walks, playful fetch and patient puppy training are my thing. Your dog gets a safe outing and you get a proper update afterwards.",
    services: ["dog-walking", "pet-taxi", "doggy-day-care"],
    petTypes: ["Dogs", "Birds"],
    rating: 4.8,
    reviewCount: 39,
    price: 900,
    priceLabel: "KSh 900 per hour",
    experienceYears: 4,
    certifications: ["Pet first aid", "Background checked"],
    responseTime: "Usually replies in 20 minutes",
    availability: ["2026-10-22", "2026-10-24", "2026-10-25", "2026-10-27", "2026-10-29", "2026-10-31"],
    unavailableDates: ["2026-10-23", "2026-10-26", "2026-10-28"],
    reviews: [
      { name: "Linet N.", date: "October 2026", rating: 5, comment: "Brian gave our energetic pup the best afternoon. We booked again before bedtime.", petName: "Nala" },
      { name: "Kevin O.", date: "August 2026", rating: 4, comment: "Very thoughtful and dependable pet taxi support for our vet appointment.", petName: "Tamu" }
    ]
  },
  {
    username: "zawadi-mwende",
    name: "Zawadi Mwende",
    location: "Karen, Nairobi",
    image: "/images/sitter-zawadi.jpg",
    coverImage: "/images/home-care.jpg",
    bio: "I offer a warm, quiet home from home for dogs, cats and little companions. My updates are detailed so you always feel close.",
    services: ["home-sitting", "boarding", "doggy-day-care"],
    petTypes: ["Dogs", "Cats", "Rabbits", "Guinea Pigs"],
    rating: 5,
    reviewCount: 62,
    price: 2400,
    priceLabel: "KSh 2,400 per night",
    experienceYears: 7,
    certifications: ["Pet first aid", "Background checked", "Senior pet care"],
    responseTime: "Usually replies in 10 minutes",
    availability: ["2026-10-22", "2026-10-23", "2026-10-24", "2026-10-26", "2026-10-27", "2026-10-28"],
    unavailableDates: ["2026-10-25", "2026-10-29", "2026-10-30"],
    reviews: [
      { name: "Michelle A.", date: "October 2026", rating: 5, comment: "Our cat settled so quickly with Zawadi. The daily updates gave us real peace of mind.", petName: "Koko" },
      { name: "Farah H.", date: "September 2026", rating: 5, comment: "A beautiful, clean space and such kind overnight care for our older dog.", petName: "Simba" }
    ]
  },
  {
    username: "kevin-kimani",
    name: "Kevin Kimani",
    location: "Lavington, Nairobi",
    image: "/images/sitter-kevin.jpg",
    coverImage: "/images/pet-care.jpg",
    bio: "I am a hands on sitter with a soft spot for shy cats, small pets and senior companions. Every visit follows your pet's preferred routine.",
    services: ["home-sitting", "pet-taxi", "grooming-referral"],
    petTypes: ["Dogs", "Cats", "Birds", "Guinea Pigs"],
    rating: 4.9,
    reviewCount: 31,
    price: 1800,
    priceLabel: "KSh 1,800 per visit",
    experienceYears: 3,
    certifications: ["Pet first aid", "Background checked"],
    responseTime: "Usually replies in 30 minutes",
    availability: ["2026-10-23", "2026-10-25", "2026-10-26", "2026-10-28", "2026-10-30", "2026-10-31"],
    unavailableDates: ["2026-10-22", "2026-10-24", "2026-10-29"],
    reviews: [
      { name: "Grace W.", date: "October 2026", rating: 5, comment: "Kevin remembered every tiny detail of Pepper's meal routine.", petName: "Pepper" },
      { name: "Aminah S.", date: "August 2026", rating: 5, comment: "Warm, reliable care with very useful photo updates.", petName: "Biscuit" }
    ]
  }
];

export const demoCareUpdates: CareUpdate[] = [
  {
    id: "care-1",
    bookingReference: "LP-10624",
    message: "Milo enjoyed a shady walk and a water break. He was very proud of finding a leafy stick.",
    photoUrl: "/images/care-update.jpg",
    createdAt: "Today at 2:15 PM"
  }
];

export function getService(serviceId: ServiceId) {
  return services.find((service) => service.id === serviceId) ?? services[0];
}

export function getSitter(username: string) {
  return sitters.find((sitter) => sitter.username === username);
}
