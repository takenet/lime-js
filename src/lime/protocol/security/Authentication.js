"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Authentication = (function () {
    function Authentication() {
    }
    Authentication.guest = "guest";
    Authentication.plain = "plain";
    Authentication.transport = "transport";
    Authentication.key = "key";
    return Authentication;
}());
exports.Authentication = Authentication;
var GuestAuthentication = (function (_super) {
    __extends(GuestAuthentication, _super);
    function GuestAuthentication() {
        _super.apply(this, arguments);
        this.scheme = Authentication.guest;
    }
    return GuestAuthentication;
}(Authentication));
exports.GuestAuthentication = GuestAuthentication;
var TransportAuthentication = (function (_super) {
    __extends(TransportAuthentication, _super);
    function TransportAuthentication() {
        _super.apply(this, arguments);
        this.scheme = Authentication.transport;
    }
    return TransportAuthentication;
}(Authentication));
exports.TransportAuthentication = TransportAuthentication;
var PlainAuthentication = (function (_super) {
    __extends(PlainAuthentication, _super);
    function PlainAuthentication() {
        _super.apply(this, arguments);
        this.scheme = Authentication.plain;
    }
    return PlainAuthentication;
}(Authentication));
exports.PlainAuthentication = PlainAuthentication;
var KeyAuthentication = (function (_super) {
    __extends(KeyAuthentication, _super);
    function KeyAuthentication() {
        _super.apply(this, arguments);
        this.scheme = Authentication.key;
    }
    return KeyAuthentication;
}(Authentication));
exports.KeyAuthentication = KeyAuthentication;
