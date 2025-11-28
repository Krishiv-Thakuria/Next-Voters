import { SupportedRegionDetails } from "@/types/supported-regions"

export const supportedRegionDetails: SupportedRegionDetails[] = [
  {
    "code": "CA",
    "name": "Canada",
    "politicalParties": [
      "Liberal Party",
      "Conservative Party"
    ],
    "collectionName": "collection-ca",
    "type": "country"
  },
  {
    "code": "US",
    "name": "United States",
    "politicalParties": [
      "Democratic Party",
      "Republican Party"
    ],
    "collectionName": "collection-us",
    "type": "country"
  },
  {
    "code": "US-CA",
    "name": "California",
    "parentRegionCode": "US",
    "politicalParties": [
      "Democratic Party",
      "Republican Party"
    ],
    "collectionName": "collection-us-ca",
    "type": "sub-region"
  },
  {
    "code": "IN",
    "name": "India",
    "politicalParties": [
      "Indian Congress",
      "BJP"
    ],
    "collectionName": "collection-in",
    "type": "country"
  }
]

export default supportedRegionDetails;
