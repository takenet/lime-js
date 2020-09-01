import Envelope from "../Envelope";
import Message, { MessageListener } from "../Message";
import Command, { CommandListener, CommandMethod, CommandStatus } from "../Command";
import Notification, { NotificationListener, NotificationEvent } from "../Notification";
import Session, { SessionListener, SessionState } from "../Session";
import Transport from "../Network/Transport";
import * as Promise from "bluebird";
import { Identity } from "../Node";

export interface MessageChannel extends MessageListener {
  sendMessage(message: Message): void;
}

export interface CommandChannel extends CommandListener {
  sendCommand(command: Command): void;
}

export interface NotificationChannel extends NotificationListener {
  sendNotification(notification: Notification): void;
}

export interface SessionChannel extends SessionListener {
  sendSession(session: Session): void;
}

export interface CommandProcessor extends CommandListener {
  processCommand(command: Command, timeout: number): Promise<any>;
}

abstract class Channel implements MessageChannel, CommandChannel, NotificationChannel, SessionChannel, CommandProcessor {

  private autoReplyPings: boolean;
  private autoNotifyReceipt: boolean;
  private _commandResolves = {};

  commandTimeout = 6000;

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

        if (command.status) {
          const responsePromise = this._commandResolves[command.id];

          if (responsePromise) {
            this._commandResolves[command.id](command);
            delete this._commandResolves[command.id]
            return;
          }
        }

        if (this.autoReplyPings && command.id &&
          command.uri === "/ping" &&
          command.method === CommandMethod.GET &&
          this.isForMe(command))
        {
          const pingCommandResponse = {
            id: command.id,
            to: command.from,
            method: CommandMethod.GET,
            status: CommandStatus.SUCCESS,
            type: "application/vnd.lime.ping+json",
            resource: {}
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

  processCommand(command: Command, timeout = this.commandTimeout): Promise<any> {
    const responsePromise = new Promise(resolve => {
      this._commandResolves[command.id] = resolve;
    });

    const commandPromise = Promise.race([
      responsePromise,
      new Promise((_, reject) => {
        setTimeout(() => {
          if (!this._commandResolves[command.id]) return

          delete this._commandResolves[command.id]

          const cmd = JSON.stringify(command)
          reject(new Error(`The follow command processing has timed out: ${cmd}`))
        }, timeout)
      })
    ])

    this.sendCommand(command)
    return commandPromise
  }

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
    if (this.autoNotifyReceipt &&
        message.id &&
        message.from &&
        this.isForMe(message)) {
      const notification: Notification = {
        id: message.id,
        to: message.from,
        event: NotificationEvent.RECEIVED
      };
      this.sendNotification(notification);
    }
  }

  private isForMe(envelope: Envelope): boolean {
    return !envelope.to || envelope.to === this.localNode ||
      Identity.parse(this.localNode) === Identity.parse(envelope.to);
  }
}

export default Channel;
