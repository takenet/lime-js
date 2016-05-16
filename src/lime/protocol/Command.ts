namespace Lime {
  export interface Command extends Envelope {
    uri?: string;
    type?: string;
    resource?: any;
    method: string;
    status?: string;
    reason?: Reason;
  }

  export class CommandMethod {
    static get = "get";
    static set = "set";
    static delete = "delete";
    static observe = "observe";
    static subscribe = "subscribe";
  } 

  export class CommandStatus {
    static success = "success";
    static failure = "failure";
  }
}