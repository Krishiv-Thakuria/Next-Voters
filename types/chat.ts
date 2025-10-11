import { Citation } from "./citations";

export interface AIAgentResponse {
    partyName: string;
    answer: string;
    citations: Citation[];
}
