import {Envelope} from "../Envelope";
import {Message} from "../Message";
import {Command, CommandMethod, CommandStatus} from "../Command";
import {Notification, NotificationEvent} from "../Notification";
import {Session, SessionState} from "../Session";
import {Transport} from "../network/Transport";
import {MessageChannel, CommandChannel, NotificationChannel, SessionChannel} from "./Channel";

export class ChannelBase implements MessageChannel, CommandChannel, NotificationChannel, SessionChannel {
  private autoReplyPings: boolean;
  private autoNotifyReceipt: boolean;

  constructor(transport: Transport, autoReplyPings: boolean, autoNotifyReceipt: boolean) {
    this.autoReplyPings = autoReplyPings;
    this.autoNotifyReceipt = autoNotifyReceipt;
    this.transport = transport;
    this.state = SessionState.new;

    this.transport.onEnvelope = (e) => {
      if (e.hasOwnProperty("event")) {
        this.onNotification(<Notification>e);
      } else if (e.hasOwnProperty("content")) {
        const message = <Message>e;
        if (this.autoNotifyReceipt &&
          message.id &&
          message.from)
        {
          const notification: Notification = {
            id: message.id,
            to: message.from,
            event: NotificationEvent.received
          };
          this.sendNotification(notification);
        }
        this.onMessage(message);
      } else if (e.hasOwnProperty("method")) {
        const command = <Command>e;
        if (this.autoReplyPings &&
          command.id &&
          command.from &&
          command.uri === "/ping" &&
          command.method === CommandMethod.get)
        {
          const pingCommandResponse: Command = {
            id: command.id,
            to: command.from,
            method: CommandMethod.get,
            status: CommandStatus.success,
            type: "application/vnd.lime.ping+json"
          }
          this.sendCommand(pingCommandResponse);
        } else {
          this.onCommand(command);
        }
      } else if (e.hasOwnProperty("state")) {
        this.onSession(<Session>e);
      }
    };
  }

  sendMessage(message: Message) {
    if (this.state !== SessionState.established) {
      throw new Error(`Cannot send in the '${this.state}' state`);
    }
    this.send(message);
  }
  onMessage(message: Message) { }

  sendCommand(command: Command) {
    if (this.state !== SessionState.established) {
      throw new Error(`Cannot send in the '${this.state}' state`);
    }
    this.send(command);
  }
  onCommand(command: Command) { }

  sendNotification(notification: Notification) {
    if (this.state !== SessionState.established) {
      throw new Error(`Cannot send in the '${this.state}' state`);
    }
    this.send(notification);
  }
  onNotification(notification: Notification) { }

  sendSession(session: Session) {
    if (this.state === SessionState.finished ||
      this.state === SessionState.failed) {
      throw new Error(`Cannot send in the '${this.state}' state`);
    }
    this.send(session);
  }
  onSession(session: Session) { }

  transport: Transport;
  remoteNode: string;
  localNode: string;
  sessionId: string;
  state: string;

  private send(envelope: Envelope) {
    this.transport.send(envelope);
  }
}
