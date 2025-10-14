import { SupportedRegionDetails } from "@/types/supported-regions"

export const supportedRegionDetails: SupportedRegionDetails[] = [

  // Countries 
  {
    code: "CA",
    name: "Canada",
    politicalParties: [
      "Liberal Party",
      "Conservative Party",
      "New Democratic Party (NDP)",
    ],
    collectionName: "collection-ca"
  },

  {
    code: "US",
    name: "United States",
    politicalParties: [
      "Democratic Party",
      "Republican Party"
    ],
    collectionName: "collection-us"
  },

  // U.S. States
  {
    code: "CA-US",
    name: "California",
    politicalParties: [
      "California Democractic Party", 
      "California Republican Party"
    ],
    collectionName: "collection-us-california"  
  },
  {
    code: "TX-US",
    name: "Texas",
    politicalParties: [
      "Texas Democratic Party", 
      "Texas Republican Party"
    ],
    collectionName: "collection-us-texas"
  },

  // Canadian Provinces
  {
    code: "ON-CA",
    name: "Ontario",
    politicalParties: [
      "Liberal Party of Ontario",
      "Progressive Conservative Party of Ontario",
      "Ontario New Democratic Party (NDP)",
    ],
    collectionName: "collection-ca-ontario"
  },
  {
    code: "QC-CA",
    name: "Quebec",
    politicalParties: [
      "Quebec Liberal Party",
      "Parti Québécois",
    ],
    collectionName: "collection-ca-quebec"
  }
]

export default supportedRegionDetails;