type Party = {
  partyName: string;
  text: string;
  citations?: any; 
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