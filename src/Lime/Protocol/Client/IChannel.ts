import {Envelope} from "../Envelope";
import {Message} from "../Message";
import {Notification} from "../Notification";
import {Command} from "../Command";
import {Session} from "../Session";

export interface IMessageChannel {
  sendMessage(message: Message): void;
  onMessage: (message: Message) => void;
}

export interface ICommandChannel {
  sendCommand(command: Command): void;
  onCommand: (command: Command) => void;
}

export interface INotificationChannel {
  sendNotification(notification: Notification): void;
  onNotification: (notification: Notification) => void;
}

export interface ISessionChannel {
  sendSession(session: Session): void;
  onSession: ISessionListener;
}

export interface ISessionListener {
  (session: Session): void;
}

export interface IEstablishSessionListener {
  (error: Error, session: Session): void;
}
