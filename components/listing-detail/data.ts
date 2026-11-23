import type { LucideIcon } from "lucide-react";

export type FacilityItem = { name: string; icon: LucideIcon; value?: string };
export type InfoItem = { label: string; value: string; icon: LucideIcon };
export type RuleItem = { text: string; icon: LucideIcon };
export type NearbyItem = { name: string; distance: string; icon: LucideIcon };