import {IEnvelope, Reason} from "./Envelope";

export interface Notification extends IEnvelope {
  event: NotificationEvent;
  reason?: Reason;
}

export interface INotificationListener {
  onNotification(command: Notification): void;
}

export const NotificationEvent = {
  ACCEPTED: <NotificationEvent> "accepted",
  VALIDATED: <NotificationEvent> "validated",
  AUTHORIZED: <NotificationEvent> "authorized",
  DISPATCHED: <NotificationEvent> "dispatched",
  RECEIVED: <NotificationEvent> "received",
  CONSUMED: <NotificationEvent> "consumed"
};
export type NotificationEvent
  = "accepted"
  | "validated"
  | "authorized"
  | "dispatched"
  | "received"
  | "consumed"
  ;
