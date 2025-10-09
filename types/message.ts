type Party = {
  partyName: string;
  text: string;
  citations?: any; // Optional citations array
};

type MeMessage = {
  type: "me";
  text: string; // always required
};

type AgentMessage = {
  type: "agent";
  parties: Party[]; // array of parties (2 or more)
};

export type Message = MeMessage | AgentMessage;