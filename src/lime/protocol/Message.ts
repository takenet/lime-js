import {Envelope} from "./Envelope";

export interface Message extends Envelope {
  type: string;
  content: any;
}
