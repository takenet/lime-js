import Identity from "./Identity";

export default class Node {
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