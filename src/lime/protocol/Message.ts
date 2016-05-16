namespace lime {
  export interface Message extends Envelope {
    type: string;
    content: any;
  }
}