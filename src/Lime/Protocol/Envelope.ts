import {Message} from './Message';
import {Notification} from './Notification';
import {Command} from './Command';
import {Session} from './Session';

export interface IEnvelope {
  id?: string;
  from?: string;
  to?: string;
  pp?: string;
  metadata?: any;
}

export type Envelope
  = Message
  | Notification
  | Command
  | Session
  ;

export const Envelope = {
  isMessage: (envelope: Envelope) => envelope.hasOwnProperty('content'),
  isNotification: (envelope: Envelope) => envelope.hasOwnProperty('event'),
  isCommand: (envelope: Envelope) => envelope.hasOwnProperty('method'),
  isSession: (envelope: Envelope) => envelope.hasOwnProperty('status')
};

export interface Reason {
  code: number;
  description?: string;
}

export interface IEnvelopeListener {
  onEnvelope(envelope: Envelope): void
}
