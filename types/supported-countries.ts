export type SupportedCountry = "USA" | "Canada"

export interface SupportedCountryDetails {
    code: string;
    name: string;
    politicalParties: { name: string }[];
}