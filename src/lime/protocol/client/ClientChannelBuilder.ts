namespace lime {                
    export class ClientChannelBuilder {
        
        private factory: TransportFactory;
        
        private uri: string;
        
        constructor(factory: TransportFactory = () => new WebSocketTransport(true)) {
            this.factory = factory;
        }
        
        withServerUri(uri: string) {
            this.uri = uri;
        }
        
    }
}