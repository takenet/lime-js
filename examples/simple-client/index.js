// TODO: write proper documentation on code

(function (window) {
  "use strict";
  
  // buttons
  var connectButton = document.getElementById("connect-button");
  var disconnectButton = document.getElementById("disconnect-button");
  var messageSendButton = document.getElementById("message-send-button");
  var setPresenceAvailableButton = document.getElementById("set-presence-available-button");
  var setReceiptsButton = document.getElementById("set-receipts-button");

  // input elements for connection
  var identityInput = document.getElementById("identity-input");
  var instanceInput = document.getElementById("instance-input");
  var passwordInput = document.getElementById("password-input");
  var uriInput = document.getElementById("uri-input");
  // input elements for messages
  var messageToInput = document.getElementById("message-to-input");
  var messageContentInput = document.getElementById("message-content-input");


  var clientChannel;

  /**
   * @param {String} uri
   * @param {String} identity
   * @param {String} instance
   * @param {String} password
   */
  function establishSession(uri, identity, instance, password) { 

    var transport = new lime.WebSocketTransport(true);
    clientChannel = new lime.ClientChannel(transport, true, true);

    clientChannel.onMessage = function (m) {
      utils.logMessage("Message received - From: " + m.from + " - To: " + m.to + " - Content: " + m.content);
    };
    clientChannel.onNotification = function (n) {
      utils.logMessage("Notification received - From: " + n.from + " - To: " + n.to + " - Event: " + n.event + " - Reason: " + n.reason);
    };
    clientChannel.onCommand = function (c) {
      utils.logMessage("Command received - From: " + c.from + " - To: " + c.to + " - Method: " + c.method + " - URI: " + c.uri + " - Resource: " + c.resource + " - Status: " + c.status + " - Reason: " + c.reason);
    };

    transport.onOpen = function () {
      var authentication;
      if (password) {
        authentication = new lime.PlainAuthentication();
        authentication.password = btoa(password);
      } else {
        authentication = new lime.GuestAuthentication();
      }

      lime.ClientChannelExtensions.establishSession(clientChannel, "none", "none", identity, authentication, instance, function (s, err) {
        if (err) {
          return utils.logMessage("An error occurred: " + e);
        }

        utils.logMessage("Session id: " + s.id + " - State: " + s.state);
        if (s.state === lime.SessionState.established) {
          connectButton.disabled = true;
          disconnectButton.disabled = false;
        }
      });
    };
    transport.onClose = function () {
      connectButton.disabled = false;
      disconnectButton.disabled = true;
      utils.logMessage("Transport is closed");
    };
    transport.onError = function (err) {
      utils.logMessage("Transport failed: " + err.message);
    };

    transport.open(uri);
  }


  window.connect = function () {
    utils.checkMandatoryInput(identityInput);
    utils.checkMandatoryInput(instanceInput);
    utils.checkMandatoryInput(uriInput);
    establishSession(uriInput.value, identityInput.value, instanceInput.value, passwordInput.value);
  };

  window.disconnect = function () {
    clientChannel.sendFinishingSession();
  };

  window.setPresence = function (available) {
    var presenceCommand = {
      id: utils.newGuid(),
      method: lime.CommandMethod.set,
      uri: "/presence",
      type: "application/vnd.lime.presence+json",
      resource: {
        status: available ? "available" : "unavailable",
        routingRule: "identity"
      }
    };
    clientChannel.sendCommand(presenceCommand);
  };

  window.setReceipts = function () {
    var presenceCommand = {
      id: utils.newGuid(),
      method: lime.CommandMethod.set,
      uri: "/receipt",
      type: "application/vnd.lime.receipt+json",
      resource: {
        events: ["accepted", "validated", "authorized", "dispatched", "received", "consumed"]
      }
    };
    clientChannel.sendCommand(presenceCommand);
  };

  window.sendMessage = function () {
    var message = {
      id: utils.newGuid(),
      to: messageToInput.value,
      type: "text/plain",
      content: messageContentInput.value
    };
    clientChannel.sendMessage(message);
  };

})(this);
