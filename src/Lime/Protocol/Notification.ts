import Envelope from "./Envelope";
import Reason from "./Reason";

interface Notification extends Envelope {
  event: NotificationEvent;
  reason?: Reason;
}
export default Notification;

export interface NotificationListener {
  onNotification(command: Notification): void;
}

export const NotificationEvent = {
  FAILED: <NotificationEvent> "failed",
  ACCEPTED: <NotificationEvent> "accepted",
  VALIDATED: <NotificationEvent> "validated",
  AUTHORIZED: <NotificationEvent> "authorized",
  DISPATCHED: <NotificationEvent> "dispatched",
  RECEIVED: <NotificationEvent> "received",
  CONSUMED: <NotificationEvent> "consumed"
};
export type NotificationEvent
  = "failed"
  | "accepted"
  | "validated"
  | "authorized"
  | "dispatched"
  | "received"
  | "consumed"
  ;
