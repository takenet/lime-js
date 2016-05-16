namespace Lime {
  export interface Message extends Envelope {
    type: string;
    content: any;
  }
}