import { Citation } from "./citations";

type Party = {
  partyName: string;
  text: string;
  citations?: Citation[]; 
};

type MeMessage = {
  type: "me";
  message: string; 
};

type AgentMessage = {
  type: "agent";
  parties: Party[]; 
};

export type Message = MeMessage | AgentMessage;