import { SupportedRegionDetails } from "@/types/supported-regions";

// Shared elections
const usStateElections = [
  "State Legislative Election",
  "State Executive Election",
];

const canadaProvincialElections = [
  "Provincial Election",
  "Territorial Election",
];

const supportedRegions: SupportedRegionDetails[] = [
  // Countries
  {
    code: "US",
    name: "United States",
    politicalParties: ["Democratic Party", "Republican Party"],
    elections: [
      "Presidential Election",
      "Congressional Election",
      "Midterm Election",
      "Gubernatorial Election",
    ],
  },
  {
    code: "CA",
    name: "Canada",
    politicalParties: [
      "Liberal Party",
      "Conservative Party",
      "New Democratic Party (NDP)",
    ],
    elections: ["Federal Election"],
  },

  // U.S. States
  {
    code: "CA-US",
    name: "California",
    politicalParties: ["Democratic Party", "Republican Party"],
    elections: usStateElections,
  },
  {
    code: "TX-US",
    name: "Texas",
    politicalParties: ["Democratic Party", "Republican Party"],
    elections: usStateElections,
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
    elections: canadaProvincialElections,
  },
  {
    code: "QC-CA",
    name: "Quebec",
    politicalParties: [
      "Quebec Liberal Party",
      "Coalition Avenir Québec (CAQ)",
      "Parti Québécois",
      "Québec Solidaire",
    ],
    elections: canadaProvincialElections,
  },
];

export default supportedRegions;
