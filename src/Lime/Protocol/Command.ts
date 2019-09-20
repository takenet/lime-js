import Envelope from "./Envelope";
import Reason from "./Reason";

interface Command extends Envelope {
  uri?: string;
  type?: string;
  resource?: any;
  method: CommandMethod;
  status?: CommandStatus;
  reason?: Reason;
  timeout?: boolean;
}
export default Command;

export interface CommandListener {
  onCommand(command: Command): void;
}

export const CommandMethod = {
  GET: <CommandMethod> "get",
  SET: <CommandMethod> "set",
  DELETE: <CommandMethod> "delete",
  OBSERVE: <CommandMethod> "observe",
  SUBSCRIBE: <CommandMethod> "subscribe",
  UNSUBSCRIBE: <CommandMethod> "unsubscribe",
  MERGE: <CommandMethod> "merge",
}
export type CommandMethod
  = "get"
  | "set"
  | "delete"
  | "observe"
  | "subscribe"
  | "unsubscribe"
  | "merge"
  ;

export const CommandStatus = {
  SUCCESS: <CommandStatus> "success",
  FAILURE: <CommandStatus> "failure"
}
export type CommandStatus
  = "success"
  | "failure"
  ;
