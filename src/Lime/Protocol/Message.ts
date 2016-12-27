import Envelope from "./Envelope";

interface Message extends Envelope {
  type: string;
  content: any;
}
export default Message;

export interface MessageListener {
  onMessage(command: Message): void;
}
