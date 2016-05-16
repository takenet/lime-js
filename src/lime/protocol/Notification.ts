import {Envelope, Reason} from "./Envelope";

export interface Notification extends Envelope {
  event: string;
  reason?: Reason;
}

export class NotificationEvent {
  static accepted = "accepted";  
  static validated = "validated";
  static authorized = "authorized";
  static dispatched = "dispatched";
  static received = "received";
  static consumed = "consumed";
}
