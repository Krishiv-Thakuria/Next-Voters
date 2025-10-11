import { Citation } from "../citations";

type Party = {
  partyName: string;
  text: string;
  citations?: Citation[]; 
};

type RegMessage = {
  type: "reg";
  message: string; 
};



type AgentMessage = {
  type: "agent";
  parties: Party[]; 
};

export type Message = RegMessage | AgentMessage;