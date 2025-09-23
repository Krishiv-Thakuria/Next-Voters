export type SupportedCountry = "USA" | "Canada"

export interface SupportedRegionDetails {
    code: string;
    name: string;
    politicalParties: string[];
    elections?: string[];
}