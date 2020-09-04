import Node from "./Node";

export default class Identity {
    constructor(
        public readonly name: string,
        public readonly domain: string) {
    }

    public toNode(): Node {
        return new Node(this);
    }

    public toString() {
        return `${this.name}@${this.domain}`;
    }

    public static parse(possibleIdentity: string | Node | Identity): Identity {
        if (possibleIdentity instanceof Node) {
            return possibleIdentity.identity;
        } else if (possibleIdentity instanceof Identity) {
            return possibleIdentity;
        } else if (typeof possibleIdentity === 'string') {
            const [name, domain] = possibleIdentity.split('@');
            if (name && domain) {
                return new Identity(name, domain.split('/')[0]);
            }
        }
    }
}
