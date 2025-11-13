export type SupportedRegions = "United States" | "Canada" | "California" | "Texas" 

export interface SupportedRegionDetails {
    code: string;
    name: string;
    type: string;
    parentRegionCode?: string;
    politicalParties: string[];
    collectionName: string;
}