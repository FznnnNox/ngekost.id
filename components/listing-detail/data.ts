import type { LucideIcon } from "lucide-react";
import {
  Bath,
  Ban,
  Bike,
  Bus,
  Calendar,
  Car,
  CheckCircle2,
  Clock,
  DoorClosed,
  Droplets,
  Flame,
  GraduationCap,
  Landmark,
  Laptop,
  Moon,
  Refrigerator,
  ShieldCheck,
  ShowerHead,
  Shirt,
  Sofa,
  Sparkles,
  Store,
  Sun,
  Users,
  Utensils,
  Video,
  BedDouble,
  Wifi,
  Wind,
} from "lucide-react";

export type FacilityItem = { name: string; icon: LucideIcon; value?: string };
export type InfoItem = { label: string; value: string; icon: LucideIcon };
export type RuleItem = { text: string; icon: LucideIcon };
export type NearbyItem = { name: string; distance: string; icon: LucideIcon };

/** Data statis untuk halaman detail (semua kartu "Book now" menuju halaman ini). */
export const listingData = {
  title: "Cedar House Premium Kost",
  location: "Cipocok Jaya, Serang City, Banten",
  type: "Male" as "Male" | "Female" | "Mixed",
  rating: 4.8,
  reviewsCount: 126,
  price: "Rp 200.000",
  period: "month",
  description:
    "Our spacious executive room offers pristine comfort with modern furnishings, private bath, and premium amenities to ensure your ultimate relaxation. High-speed internet and quiet environments make this ideal for students and professionals looking for quality living.",

  photos: [
    "/assets/kosan.jpg",
    "/assets/image02.png",
    "/assets/image03.png",
    "/assets/image04.png",
    "/assets/kosan.jpg",
    "/assets/image02.png",
    "/assets/image03.png",
  ],

  roomFacilities: [
    { name: "High-speed Wi-Fi", icon: Wifi },
    { name: "Air Conditioner", icon: Wind },
    { name: "Queen Bed", icon: BedDouble },
    { name: "Study Desk", icon: Laptop },
    { name: "Wardrobe", icon: DoorClosed },
    { name: "24/7 Security", icon: ShieldCheck },
  ] as FacilityItem[],

  bathroomFacilities: [
    { name: "Private Bathroom", icon: Bath },
    { name: "Shower", icon: ShowerHead },
    { name: "Hot Water Heater", icon: Flame },
    { name: "Bidet Spray", icon: Droplets },
    { name: "Sink & Mirror", icon: Sparkles },
    { name: "Towel Rack", icon: CheckCircle2 },
  ] as FacilityItem[],

  sharedFacilities: [
    { name: "Shared Kitchen", icon: Utensils },
    { name: "Common Lounge", icon: Sofa },
    { name: "Laundry Area", icon: Shirt },
    { name: "Drying Area", icon: Sun },
    { name: "Refrigerator", icon: Refrigerator },
    { name: "CCTV", icon: Video },
  ] as FacilityItem[],

  parking: [
    { name: "Car Parking", icon: Car, value: "2 slots" },
    { name: "Motorcycle Parking", icon: Bike, value: "10 slots" },
    { name: "Guarded Parking", icon: ShieldCheck, value: "24 hours" },
  ] as FacilityItem[],

  rulesInfo: [
    { label: "Check-in", value: "2:00 PM - 9:00 PM", icon: Clock },
    { label: "Check-out", value: "12:00 PM", icon: Clock },
    { label: "Minimum Stay", value: "1 Month", icon: Calendar },
    { label: "Deposit", value: "1 Month (refundable)", icon: CheckCircle2 },
  ] as InfoItem[],

  otherRules: [
    { text: "Quiet hours from 10:00 PM to 6:00 AM", icon: Moon },
    { text: "No smoking inside the rooms", icon: Ban },
    { text: "Visitors are allowed in common areas until 9:00 PM", icon: Users },
    {
      text: "Opposite-gender visitors are not allowed in the rooms",
      icon: Ban,
    },
    { text: "Pets are not allowed", icon: Ban },
    { text: "Rent is paid by the 5th of every month", icon: Calendar },
  ] as RuleItem[],

  map: {
    address: "Jl. Cipocok Raya No. 12, Cipocok Jaya, Serang City, Banten",
    landmark: "Next to the minimarket, white building with a green gate",
    lat: -6.124,
    lng: 106.14,
    nearby: [
      { name: "Minimarket", distance: "150 m", icon: Store },
      { name: "Food street", distance: "300 m", icon: Utensils },
      { name: "Mosque", distance: "400 m", icon: Landmark },
      { name: "Bus stop", distance: "500 m", icon: Bus },
      { name: "Campus", distance: "1.2 km", icon: GraduationCap },
    ] as NearbyItem[],
  },
};
