import { SupportedCountryDetails } from "@/types/supported-countries";

const supportedCountriesDetails: SupportedCountryDetails[] = [
  { 
    code: 'US', 
    name: 'United States',
    politicalParties: [
        { name: 'Democratic Party'},
        { name: 'Republican Party'}
    ] 
  },

  { 
    code: 'CA', 
    name: 'Canada',
    politicalParties: [
        { name: 'Liberal Party'},
        { name: 'Conservative Party'},
        { name: 'New Democratic Party (NDP)'},
    ]
  }
]

export default supportedCountriesDetails;