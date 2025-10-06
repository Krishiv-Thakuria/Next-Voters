import { SupportedRegionDetails } from "@/types/supported-regions"

const supportedRegionDetails: SupportedRegionDetails[] = [

  // Countries 
  {
    code: "CA",
    name: "Canada",
    politicalParties: [
      "Liberal Party",
      "Conservative Party",
      "New Democratic Party (NDP)",
    ],
  },

  {
    code: "US",
    name: "United States",
    politicalParties: [
      "Democratic Party",
      "Republican Party"
    ]
  },

  // U.S. States
  {
    code: "CA-US",
    name: "California",
    politicalParties: [
      "California Democractic Party", 
      "California Republican Party"
    ]
  },
  {
    code: "TX-US",
    name: "Texas",
    politicalParties: [
      "Texas Democratic Party", 
      "Texas Republican Party"
    ],
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
  },
  {
    code: "QC-CA",
    name: "Quebec",
    politicalParties: [
      "Quebec Liberal Party",
      "Parti Québécois",
    ],
  }
]

export default supportedRegionDetails;