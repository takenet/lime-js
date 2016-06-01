import {IEnvelope, Reason} from "./Envelope";

export interface Command extends IEnvelope {
  uri?: string;
  type?: string;
  resource?: any;
  method: CommandMethod;
  status?: CommandStatus;
  reason?: Reason;
}

export interface ICommandListener {
  onCommand(command: Command): void;
}

export const CommandMethod = {
  GET: <CommandMethod> "get",
  SET: <CommandMethod> "set",
  DELETE: <CommandMethod> "delete",
  OBSERVE: <CommandMethod> "observe",
  SUBSCRIBE: <CommandMethod> "subscribe"
}
export type CommandMethod
  = "get"
  | "set"
  | "delete"
  | "observe"
  | "subscribe"
  ;

export const CommandStatus = {
  SUCCESS: <CommandStatus> "success",
  FAILURE: <CommandStatus> "failure"
}
export type CommandStatus
  = "success"
  | "failure"
  ;
