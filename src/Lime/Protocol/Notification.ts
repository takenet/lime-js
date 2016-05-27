import {IEnvelope, Reason} from "./Envelope";

export interface Notification extends IEnvelope {
  event: NotificationEvent;
  reason?: Reason;
}

export interface INotificationListener {
  onNotification(command: Notification): void;
}

export const NotificationEvent = {
  Accepted: <NotificationEvent> "accepted",
  Validated: <NotificationEvent> "validated",
  Authorized: <NotificationEvent> "authorized",
  Dispatched: <NotificationEvent> "dispatched",
  Received: <NotificationEvent> "received",
  Consumed: <NotificationEvent> "consumed"
};
export type NotificationEvent
  = "accepted"
  | "validated"
  | "authorized"
  | "dispatched"
  | "received"
  | "consumed"
  ;
