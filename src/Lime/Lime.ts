// Lime
export
  { Envelope
  , Reason
  , EnvelopeListener
  } from "./Protocol/Envelope";
export
  { Message
  , MessageListener
  } from "./Protocol/Message";
export
  { Notification
  , NotificationEvent
  , NotificationListener
  } from "./Protocol/Notification";
export
  { Command
  , CommandMethod
  , CommandStatus
  , CommandListener
  } from "./Protocol/Command";
export
  { Session
  , SessionState
  , SessionEncryption
  , SessionCompression
  } from "./Protocol/Session";

// Lime.Security
export
  { Authentication
  , GuestAuthentication
  , PlainAuthentication
  , TransportAuthentication
  , KeyAuthentication
  } from "./Protocol/Security/Authentication";

// Lime.Channel
export
  { Channel
  , MessageChannel
  , CommandChannel
  , NotificationChannel
  , SessionChannel
  } from "./Protocol/Client/Channel";
export { ClientChannel } from "./Protocol/Client/ClientChannel";

// Lime.Network
export { Transport } from "./Protocol/Network/Transport";

export function Guid() {
  let d = new Date().getTime();
  let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}
