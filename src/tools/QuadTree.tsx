type Point = {
    x: number;
    y: number;
    width: number;
    height: number;
};

class Rectangle {
    public x: number;
    public y: number;
    public width: number;
    public height: number;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    contains(point: Point): boolean {
        return (point.x >= this.x &&
            point.x <= this.x + this.width &&
            point.y >= this.y &&
            point.y <= this.y + this.height);
    }

    intersects(range: Rectangle): boolean {
        return !(range.x > this.x + this.width ||
            range.x + range.width < this.x ||
            range.y > this.y + this.height ||
            range.y + range.height < this.y);
    }
}

class QuadTree {
    private boundary: Rectangle;
    private capacity: number;
    private points: Point[] = [];
    private divided: boolean = false;
    private northeast?: QuadTree;
    private northwest?: QuadTree;
    private southeast?: QuadTree;
    private southwest?: QuadTree;

    constructor(boundary: Rectangle, capacity: number) {
        this.boundary = boundary;
        this.capacity = capacity;
    }

    insert(point: Point): boolean {
        if (!this.boundary.contains(point)) {
            return false;
        }

        if (this.points.length < this.capacity) {
            this.points.push(point);
            return true;
        } else {
            if (!this.divided) {
                this.subdivide();
            }

            if (this.northeast!.insert(point) || this.northwest!.insert(point) ||
                this.southeast!.insert(point) || this.southwest!.insert(point)) {
                return true;
            }
        }

        return false;
    }

    query(range: Rectangle, found: Point[] = []): Point[] {
        if (!this.boundary.intersects(range)) {
            return found;
        }
        for (const point of this.points) {
            if (range.contains(point)) {
                found.push(point);
            }
        }

        if (this.divided) {
            this.northeast!.query(range, found);
            this.northwest!.query(range, found);
            this.southeast!.query(range, found);
            this.southwest!.query(range, found);
        }
        return found;
    }

    delete(point: Point): boolean {
        if (!this.boundary.contains(point)) {
            return false;
        }

        const index = this.points.findIndex(p => p.x === point.x && p.y === point.y);
        if (index !== -1) {
            this.points.splice(index, 1);
            console.log('delete', point)
            return true;
        } else {
            if (this.divided) {
                return this.northeast!.delete(point) || this.northwest!.delete(point) ||
                    this.southeast!.delete(point) || this.southwest!.delete(point);
            }
        }

        return false;
    }

    private subdivide(): void {
        const x = this.boundary.x;
        const y = this.boundary.y;
        const w = this.boundary.width / 2;
        const h = this.boundary.height / 2;

        this.northeast = new QuadTree(new Rectangle(x + w, y, w, h), this.capacity);
        this.northwest = new QuadTree(new Rectangle(x, y, w, h), this.capacity);
        this.southeast = new QuadTree(new Rectangle(x + w, y + h, w, h), this.capacity);
        this.southwest = new QuadTree(new Rectangle(x, y + h, w, h), this.capacity);

        this.divided = true;
    }

    public getTotalLength(): number {
        let total = this.points.length;
        if (this.divided) {
            total += this.northeast!.getTotalLength();
            total += this.northwest!.getTotalLength();
            total += this.southeast!.getTotalLength();
            total += this.southwest!.getTotalLength();
        }
        return total;
    }

    public printBoundaries(): void {
        console.log(`Boundary: x=${this.boundary.x}, y=${this.boundary.y}, width=${this.boundary.width}, height=${this.boundary.height}`);
        if (this.divided) {
            this.northeast!.printBoundaries();
            this.northwest!.printBoundaries();
            this.southeast!.printBoundaries();
            this.southwest!.printBoundaries();
        }
    }
}

export {QuadTree, Rectangle};
export type {Point};
