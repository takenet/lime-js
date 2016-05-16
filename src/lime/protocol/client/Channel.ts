import {Envelope} from "../Envelope";
import {Message} from "../Message";
import {Notification} from "../Notification";
import {Command} from "../Command";
import {Session} from "../Session";

export interface MessageChannel {
  sendMessage(message: Message): void;
  onMessage: (message: Message) => void;
}

export interface CommandChannel {
  sendCommand(command: Command): void;
  onCommand: (command: Command) => void;
}

export interface NotificationChannel {
  sendNotification(notification: Notification): void;
  onNotification: (notification: Notification) => void;
}

export interface SessionChannel {
  sendSession(session: Session): void;
  onSession: SessionListener;
}

export interface SessionListener {
  (session: Session): void;
}

export interface EstablishSessionListener {
  (error: Error, session: Session): void;
}
