import { Citation } from "../citations";

export interface AIAgentResponse {
    partyName: string;
    partyStance: string[];
    supportingDetails: string[];
    citations: Citation[];
}
