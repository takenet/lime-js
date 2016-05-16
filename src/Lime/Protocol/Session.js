"use strict";
var SessionState = (function () {
    function SessionState() {
    }
    SessionState.new = "new";
    SessionState.negotiating = "negotiating";
    SessionState.authenticating = "authenticating";
    SessionState.established = "established";
    SessionState.finishing = "finishing";
    SessionState.finished = "finished";
    SessionState.failed = "failed";
    return SessionState;
}());
exports.SessionState = SessionState;
var SessionEncryption = (function () {
    function SessionEncryption() {
    }
    SessionEncryption.none = "none";
    SessionEncryption.tls = "tls";
    return SessionEncryption;
}());
exports.SessionEncryption = SessionEncryption;
var SessionCompression = (function () {
    function SessionCompression() {
    }
    SessionCompression.none = "none";
    SessionCompression.gzip = "gzip";
    return SessionCompression;
}());
exports.SessionCompression = SessionCompression;
