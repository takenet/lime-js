namespace Lime {

  export interface IMessage extends IEnvelope {
    type: string;
    content: any;
  }
}
