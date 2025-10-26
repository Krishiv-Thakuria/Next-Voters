import { Field } from "@/types/chat-platform/embed-pdf-fields"

export const inputFields: Field[] = [
  { 
    name: "documentLink", 
    value: "Document Link" 
  },
  { 
    name: "author", 
    value: "Author" 
  },
  { 
    name: "documentName", 
    value: "Document Name" 
  }
]
export const selectFields: Field[] = [
  { 
    name: "region", 
    value: "Region", 
  },
  { 
    name: "politicalAffiliation", 
    value: "Political Affiliation", 
  }
]