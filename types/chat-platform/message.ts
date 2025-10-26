import { AIAgentResponse } from "./chat-platform";

type RegMessage = {
  type: "reg";
  message: string; 
};

type AgentMessage = {
  type: "agent";
  parties: AIAgentResponse[]; 
};

export type Message = RegMessage | AgentMessage;