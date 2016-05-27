import {IEnvelope} from "./Envelope";

export interface Message extends IEnvelope {
  type: string;
  content: any;
}

export interface IMessageListener {
  onMessage(command: Message): void;
}
