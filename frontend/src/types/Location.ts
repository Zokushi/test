export interface Review {
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Location {
  id: number;
  name: string;
  desc: string;
  img: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  features?: string[];
  history?: string;
  reviews?: Review[];
  latitude?: number;
  longitude?: number;
  website?: string;
  contactEmail?: string;
  isFeatured?: boolean;
  pricePerNight?: number | string;
  maxGuests?: number;
}
