export type SupportedRegions = "United States" | "Canada" | "California" | "Texas" | "Ontario" | "Quebec"

export interface SupportedRegionDetails {
    code: string;
    name: string;
    politicalParties: string[];
}