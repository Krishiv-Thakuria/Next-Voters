import { SupportedRegionDetails } from "@/types/supported-regions"

export const supportedRegionDetails: SupportedRegionDetails[] = [
  {
    code: "CA",
    name: "Canada",
    politicalParties: [
      "Liberal Party",
      "Conservative Party",
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
  }
]

export default supportedRegionDetails;