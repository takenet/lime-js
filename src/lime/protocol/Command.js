"use strict";
var CommandMethod = (function () {
    function CommandMethod() {
    }
    CommandMethod.get = "get";
    CommandMethod.set = "set";
    CommandMethod.delete = "delete";
    CommandMethod.observe = "observe";
    CommandMethod.subscribe = "subscribe";
    return CommandMethod;
}());
exports.CommandMethod = CommandMethod;
var CommandStatus = (function () {
    function CommandStatus() {
    }
    CommandStatus.success = "success";
    CommandStatus.failure = "failure";
    return CommandStatus;
}());
exports.CommandStatus = CommandStatus;
