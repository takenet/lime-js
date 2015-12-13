namespace Lime {

  export interface ICommand extends IEnvelope {
    uri?: string;
    type?: string;
    resource?: any;
    method: string;
    status?: string;
    reason?: IReason;
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
