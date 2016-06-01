import {Envelope} from "../Envelope";
import {Message} from "../Message";
import {Command, CommandMethod, CommandStatus} from "../Command";
import {Notification, NotificationEvent} from "../Notification";
import {Session, SessionState} from "../Session";
import {Transport} from "../Network/Transport";
import {IMessageChannel, ICommandChannel, INotificationChannel, ISessionChannel} from "./IChannel";

export abstract class Channel implements IMessageChannel, ICommandChannel, INotificationChannel, ISessionChannel {

  private autoReplyPings: boolean;
  private autoNotifyReceipt: boolean;

  transport: Transport;
  remoteNode: string;
  localNode: string;
  sessionId: string;
  state: SessionState;

  constructor(transport: Transport, autoReplyPings: boolean, autoNotifyReceipt: boolean) {
    this.autoReplyPings = autoReplyPings;
    this.autoNotifyReceipt = autoNotifyReceipt;
    this.transport = transport;
    this.state = SessionState.NEW;

    this.transport.onEnvelope = (envelope) => {
      // Message
      if (Envelope.isMessage(envelope)) {
        const message = <Message>envelope;
        this.notifyMessage(message);
        this.onMessage(message);
      }
      // Notification
      else if (Envelope.isNotification(envelope)) {
        const notification = <Notification>envelope;
        this.onNotification(notification);
      }
      // Command
      else if (Envelope.isCommand(envelope)) {
        const command = <Command>envelope;
        if (this.autoReplyPings && command.id && command.from &&
          command.uri === "/ping" && command.method === CommandMethod.GET)
        {
          const pingCommandResponse = {
            id: command.id,
            to: command.from,
            method: CommandMethod.GET,
            status: CommandStatus.SUCCESS,
            type: "application/vnd.lime.ping+json"
          }
          this.sendCommand(pingCommandResponse);
        }
        this.onCommand(command);
      }
      // Session
      else if (Envelope.isSession(envelope)) {
        const session = <Session>envelope;
        this.onSession(session);
      }
    };
  }

  sendMessage(message: Message) {
    if (this.state !== SessionState.ESTABLISHED) {
      throw new Error(`Cannot send in the '${this.state}' state`);
    }
    this.send(message);
  }
  abstract onMessage(message: Message): void;

  sendCommand(command: Command) {
    if (this.state !== SessionState.ESTABLISHED) {
      throw new Error(`Cannot send in the '${this.state}' state`);
    }
    this.send(command);
  }
  abstract onCommand(message: Command): void;

  sendNotification(notification: Notification) {
    if (this.state !== SessionState.ESTABLISHED) {
      throw new Error(`Cannot send in the '${this.state}' state`);
    }
    this.send(notification);
  }
  abstract onNotification(message: Notification): void;

  sendSession(session: Session) {
    if (this.state === SessionState.FINISHED || this.state === SessionState.FAILED) {
      throw new Error(`Cannot send in the '${this.state}' state`);
    }
    this.send(session);
  }
  abstract onSession(message: Session): void;

  private send(envelope: Envelope) {
    this.transport.send(envelope);
  }

  private notifyMessage(message: Message) {
    if (this.autoNotifyReceipt && message.id && message.from) {
      const notification: Notification = {
        id: message.id,
        to: message.from,
        event: NotificationEvent.RECEIVED
      };
      this.sendNotification(notification);
    }
  }
}
