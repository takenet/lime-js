let  transport = new WebSocketTransport();

let identity = "andreb@msging.net"
let instance = "web"

transport.onOpen = () => {

    let clientChannel = new Lime.ClientChannel(transport, true, true);
    let authentication = new Lime.PlainAuthentication();

    Lime.ClientChannelExtensions.establishSession(clientChannel, "none", "none", identity, authentication, instance, {
      onResult (s) {
        console.assert(s.state === Lime.SessionState.established)
      },
      onFailure (e) {  }
    });


    clientChannel.onMessage = (IMessage m) => {}
    clientChannel.onNotification = (INotification n) => {}
    clientChannel.onCommand = (ICommand c) => {}

}

transport.onClose = () => {}
transport.onError = (e) => {}

transport.open('ws://oi');

// -------------------



var ajaxTransport = new XhrTransport('http://tial');

let transport = new WebSocketTransport('ws://oi');
var channel = new ClientChannel(transport);
channel.connectWithPlain(identity, instance)
  .then((s) => {
    console.assert(s.state === Lime.SessionState.established)
  })
  .catch((e) => {

  })

channel.onMessage((IMessage m) => {})
channel.onNotification((INotification n) => {})
channel.onCommand((ICommand c) => {})
