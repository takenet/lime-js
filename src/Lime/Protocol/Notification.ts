namespace Lime {

  export interface INotification extends IEnvelope {
    event: string;
    reason?: IReason;
  }

  export class NotificationEvent {
    static accepted = "accepted";
    static validated = "validated";
    static authorized = "authorized";
    static dispatched = "dispatched";
    static received = "received";
    static consumed = "consumed";
  }
}
