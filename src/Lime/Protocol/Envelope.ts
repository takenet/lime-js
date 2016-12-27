import Message from './Message';
import Notification from './Notification';
import Command from './Command';
import Session from './Session';

interface Envelope {
  id?: string;
  from?: string;
  to?: string;
  pp?: string;
  metadata?: any;
}

const Envelope = {
  isMessage: (envelope: Envelope) => envelope.hasOwnProperty('content'),
  isNotification: (envelope: Envelope) => envelope.hasOwnProperty('event'),
  isCommand: (envelope: Envelope) => envelope.hasOwnProperty('method'),
  isSession: (envelope: Envelope) => envelope.hasOwnProperty('state')
};

export interface EnvelopeListener {
  onEnvelope(envelope: Envelope): void
}

export default Envelope;
