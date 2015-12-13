namespace Lime {

  export class Channel implements IChannel {
    private autoReplyPings: boolean;
    private autoNotifyReceipt: boolean;

    constructor(transport: ITransport, autoReplyPings: boolean, autoNotifyReceipt: boolean) {
      this.autoReplyPings = autoReplyPings;
      this.autoNotifyReceipt = autoNotifyReceipt;
      this.transport = transport;
      this.transport.onEnvelope = e => {
        if (e.hasOwnProperty("event")) {
          this.onNotification(<INotification>e);
        } else if (e.hasOwnProperty("content")) {
          const message = <IMessage>e;
          if (this.autoNotifyReceipt &&
              message.id &&
              message.from) {
              const notification: INotification = {
                id: message.id,
                to: message.from,
                event: NotificationEvent.received
              };
              this.sendNotification(notification);
          }
          this.onMessage(message);
        } else if (e.hasOwnProperty("method")) {
          const command = <ICommand>e;
          if (this.autoReplyPings &&
            command.id &&
            command.from &&
             command.uri === "/ping" &&
            command.method === CommandMethod.get) {
            const pingCommandResponse: ICommand = {
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
          this.onSession(<ISession>e);
        }
      };
      this.state = SessionState.new;
    }

    sendMessage(message: IMessage) {
      if (this.state !== SessionState.established) {
        throw new Error(`Cannot send in the '${this.state}' state`);
      }
      this.send(message);
    }
    onMessage(message: IMessage) { }

    sendCommand(command: ICommand) {
      if (this.state !== SessionState.established) {
        throw new Error(`Cannot send in the '${this.state}' state`);
      }
      this.send(command);
    }
    onCommand(command: ICommand) { }

    sendNotification(notification:INotification) {
      if (this.state !== SessionState.established) {
        throw new Error(`Cannot send in the '${this.state}' state`);
      }
      this.send(notification);
    }
    onNotification(notification: INotification) { }

    sendSession(session: ISession) {
      if (this.state === SessionState.finished ||
        this.state === SessionState.failed) {
        throw new Error(`Cannot send in the '${this.state}' state`);
      }
      this.send(session);
    }
    onSession(session: ISession) { }

    transport: ITransport;
    remoteNode: string;
    localNode: string;
    sessionId: string;
    state: string;

    private send(envelope: IEnvelope) {
      this.transport.send(envelope);
    }
  }
}
