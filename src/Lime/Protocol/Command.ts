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
  Get: <CommandMethod> "get",
  Set: <CommandMethod> "set",
  Delete: <CommandMethod> "delete",
  Observe: <CommandMethod> "observe",
  Subscribe: <CommandMethod> "subscribe"
}
export type CommandMethod
  = "get"
  | "set"
  | "delete"
  | "observe"
  | "subscribe"
  ;

export const CommandStatus = {
  Success: <CommandStatus> "success",
  Failure: <CommandStatus> "failure"
}
export type CommandStatus
  = "success"
  | "failure"
  ;
