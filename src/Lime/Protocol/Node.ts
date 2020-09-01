export class Node {
    constructor(
        public readonly identity: Identity,
        public readonly instance: string = undefined) {
    }

    public toIdentity(): Identity {
        return this.identity;
    }

    public toString() {
        if (!this.instance) {
            return this.identity.toString();
        }

        return `${this.identity}/${this.instance}`;
    }

    public static parse(possibleNode: string | Node | Identity): Node {
        if (possibleNode instanceof Node) {
            return possibleNode;
        } else {
            const identity = Identity.parse(possibleNode);
            if (identity) {
                const instance = possibleNode.toString().substring(identity.toString().length + 1)
                return new Node(identity, instance)
            }
        }
    }
}

export class Identity {
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
