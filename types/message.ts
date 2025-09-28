type Party = {
  partyName: string;
  text: string;
};

type MeMessage = {
  type: "me";
  text: string; // always required
};

type AgentMessage = {
  type: "agent";
  parties: [Party, Party]; // always exactly 2
};

export type Message = MeMessage | AgentMessage;