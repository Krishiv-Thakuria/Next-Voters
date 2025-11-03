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
  },

  {
    code: "US-CA",
    name: "California",
    type: "sub-region",
    parentRegionCode: "US",
    politicalParties: [
      "Democratic Party",
      "Republican Party"
    ],
    collectionName: "collection-us-ca"
  }
]

export default supportedRegionDetails;