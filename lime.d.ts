declare namespace lime {
    interface MessageChannel {
        sendMessage(message: Message): void;
        onMessage: (message: Message) => void;
    }
    interface CommandChannel {
        sendCommand(command: Command): void;
        onCommand: (command: Command) => void;
    }
    interface NotificationChannel {
        sendNotification(notification: Notification): void;
        onNotification: (notification: Notification) => void;
    }
    interface SessionChannel {
        sendSession(session: Session): void;
        onSession: SessionListener;
    }
    interface SessionListener {
        (session: Session): void;
    }
    interface EstablishSessionListener {
        (session: Session, error: Error): void;
    }
}
declare namespace lime {
    class ChannelBase implements MessageChannel, CommandChannel, NotificationChannel, SessionChannel {
        private autoReplyPings;
        private autoNotifyReceipt;
        constructor(transport: Transport, autoReplyPings: boolean, autoNotifyReceipt: boolean);
        sendMessage(message: Message): void;
        onMessage(message: Message): void;
        sendCommand(command: Command): void;
        onCommand(command: Command): void;
        sendNotification(notification: Notification): void;
        onNotification(notification: Notification): void;
        sendSession(session: Session): void;
        onSession(session: Session): void;
        transport: Transport;
        remoteNode: string;
        localNode: string;
        sessionId: string;
        state: string;
        private send(envelope);
    }
}
declare namespace lime {
    class ClientChannel extends ChannelBase {
        constructor(transport: Transport, autoReplyPings?: boolean, autoNotifyReceipt?: boolean);
        startNewSession(): void;
        negotiateSession(sessionCompression: string, sessionEncryption: string): void;
        authenticateSession(identity: string, authentication: Authentication, instance: string): void;
        sendFinishingSession(): void;
        onSessionNegotiating(session: Session): void;
        onSessionAuthenticating(session: Session): void;
        onSessionEstablished(session: Session): void;
        onSessionFinished(session: Session): void;
        onSessionFailed(session: Session): void;
    }
}
declare namespace lime {
    class ClientChannelExtensions {
        static establishSession(clientChannel: ClientChannel, compression: string, encryption: string, identity: string, authentication: Authentication, instance: string, callback: EstablishSessionListener): void;
        private static removeListeners(clientChannel);
    }
}
declare namespace lime {
    interface Transport extends TransportStateListener {
        send(envelope: Envelope): void;
        onEnvelope: (envelope: Envelope) => void;
        open(uri: string): void;
        close(): void;
        getSupportedCompression(): string[];
        setCompression(compression: string): void;
        compression: string;
        getSupportedEncryption(): string[];
        setEncryption(encryption: string): void;
        encryption: string;
        isConnected(): boolean;
    }
    interface TransportEnvelopeListener {
        (envelope: Envelope): void;
    }
    interface TransportStateListener {
        onOpen: () => void;
        onClose: () => void;
        onError: (error: Error) => void;
    }
}
declare namespace lime {
    class WebSocketTransport implements Transport {
        private traceEnabled;
        webSocket: WebSocket;
        constructor(traceEnabled?: boolean);
        send(envelope: Envelope): void;
        onEnvelope(envelope: Envelope): void;
        open(uri: string): void;
        close(): void;
        private ensureSocketOpen();
        getSupportedCompression(): string[];
        setCompression(compression: string): void;
        compression: string;
        getSupportedEncryption(): string[];
        setEncryption(encryption: string): void;
        encryption: string;
        onOpen(): void;
        onClose(): void;
        onError(error: Error): void;
        isConnected(): boolean;
    }
}
declare namespace lime {
    class Authentication {
        scheme: string;
        static guest: string;
        static plain: string;
        static transport: string;
        static key: string;
    }
    class GuestAuthentication extends Authentication {
        scheme: string;
    }
    class TransportAuthentication extends Authentication {
        scheme: string;
    }
    class PlainAuthentication extends Authentication {
        scheme: string;
        password: string;
    }
    class KeyAuthentication extends Authentication {
        scheme: string;
        key: string;
    }
}
declare namespace lime {
    interface Command extends Envelope {
        uri?: string;
        type?: string;
        resource?: any;
        method: string;
        status?: string;
        reason?: Reason;
    }
    class CommandMethod {
        static get: string;
        static set: string;
        static delete: string;
        static observe: string;
        static subscribe: string;
    }
    class CommandStatus {
        static success: string;
        static failure: string;
    }
}
declare namespace lime {
    interface Envelope {
        id?: string;
        from?: string;
        to?: string;
        pp?: string;
        metadata?: any;
    }
    interface Reason {
        code: number;
        description?: string;
    }
}
declare namespace lime {
    interface Message extends Envelope {
        type: string;
        content: any;
    }
}
declare namespace lime {
    interface Notification extends Envelope {
        event: string;
        reason?: Reason;
    }
    class NotificationEvent {
        static accepted: string;
        static validated: string;
        static authorized: string;
        static dispatched: string;
        static received: string;
        static consumed: string;
    }
}
declare namespace lime {
    interface Session extends Envelope {
        state: string;
        encryptionOptions?: string[];
        encryption?: string;
        compressionOptions?: string[];
        compression?: string;
        scheme?: string;
        authentication?: any;
        reason?: Reason;
    }
    class SessionState {
        static new: string;
        static negotiating: string;
        static authenticating: string;
        static established: string;
        static finishing: string;
        static finished: string;
        static failed: string;
    }
    class SessionEncryption {
        static none: string;
        static tls: string;
    }
    class SessionCompression {
        static none: string;
        static gzip: string;
    }
}
