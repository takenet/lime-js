namespace Lime {

  export interface IMessageChannel {
    sendMessage(message: IMessage): void;
    onMessage: (message: IMessage) => void;
  }

  export interface ICommandChannel {
    sendCommand(command: ICommand): void;
    onCommand: (command: ICommand) => void;
  }

  export interface INotificationChannel {
    sendNotification(notification: INotification): void;
    onNotification: (notification: INotification) => void;
  }

  export interface ISessionChannel {
    sendSession(session: ISession): void;
    onSession: ISessionListener;
  }

  export interface IChannel extends IMessageChannel, ICommandChannel, INotificationChannel, ISessionChannel {
    transport: ITransport;
    remoteNode: string;
    localNode: string;
    sessionId: string;
    state: string;
  }


  export interface ISessionListener {
    (session: ISession): void;
  }
  export interface IEstablishSessionListener {
    onResult: ISessionListener;
    onFailure: (exception: string) => void;
  }
}
