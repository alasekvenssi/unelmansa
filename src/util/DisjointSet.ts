export default class DisjointNode {
    constructor(public parent: DisjointNode = null, public size: number = 1, public rank: number = 0) {
    }

    getParent(): DisjointNode {
        if (this.parent == null) {
            return this;
        }

        let parent: DisjointNode = this.parent.getParent();
        this.parent = parent;
        return parent;
    }

    union(rhs: DisjointNode): void {
        let lhsParent: DisjointNode = this.getParent();
        let rhsParent: DisjointNode = rhs.getParent();

        if (lhsParent == rhsParent) {
            return;
        }

        if (lhsParent.rank < rhsParent.rank) {
            lhsParent.parent = rhsParent;
            rhsParent.size += lhsParent.size;
        } else if (lhsParent.rank > rhsParent.rank) {
            rhsParent.parent = lhsParent;
            lhsParent.size += rhsParent.size;
        } else {
            lhsParent.parent = rhsParent;
            rhsParent.size += lhsParent.size;
            rhsParent.rank++;
        }
    }

    isSameSet(rhs: DisjointNode): boolean {
        return (this.getParent() == rhs.getParent() ? true : false);
    }

    getSize(): number {
        return this.getParent().size;
    }
}