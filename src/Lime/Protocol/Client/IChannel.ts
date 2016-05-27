import {Envelope} from "../Envelope";
import {Message, IMessageListener} from "../Message";
import {Notification, INotificationListener} from "../Notification";
import {Command, ICommandListener} from "../Command";
import {Session, ISessionListener} from "../Session";

export interface IMessageChannel extends IMessageListener {
  sendMessage(message: Message): void;
}

export interface ICommandChannel extends ICommandListener {
  sendCommand(command: Command): void;
}

export interface INotificationChannel extends INotificationListener {
  sendNotification(notification: Notification): void;
}

export interface ISessionChannel extends ISessionListener {
  sendSession(session: Session): void;
}
