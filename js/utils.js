(function(window) {

  window.utils = window.utils || {};

  utils.newGuid = function() {
    var d = new Date().getTime();
    var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  };

  utils.checkMandatoryInput = function(input) {
    if(!input.value) {
      throw new Error("The input element " + input.id + " is mandatory.");
    }
    return true;
  };

  var logTextarea = document.getElementById("log-textarea");
  utils.logMessage = function(message) {
    var log = logTextarea.value;
    if(log) {
      log += "\r\n";
    }
    log += message;
    logTextarea.value = log;
  };
})(this);
