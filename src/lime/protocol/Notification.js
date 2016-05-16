"use strict";
var NotificationEvent = (function () {
    function NotificationEvent() {
    }
    NotificationEvent.accepted = "accepted";
    NotificationEvent.validated = "validated";
    NotificationEvent.authorized = "authorized";
    NotificationEvent.dispatched = "dispatched";
    NotificationEvent.received = "received";
    NotificationEvent.consumed = "consumed";
    return NotificationEvent;
}());
exports.NotificationEvent = NotificationEvent;
