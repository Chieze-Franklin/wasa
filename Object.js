class GameObject {
    public normals: any;
    public textures: any;

    public create() {
        // add to EntityManager
    }
    public destroy() {
        // remove from EntityManager
    }
    public on(event: any) {
        if (event.type === "click") {
            // do something (change a property)
        } else if (event.type === "collision") {
            const collidingObject = event.collisions[0].xyz;
            if (collidingObject.type === "bomb") {
                this.speed = 0;
                // create the explotion object at this point
                const explosion = new Explosion({ x: this.location.x + 10, y: this.location.y, initialSize: 10, objectsToDestroy: [this, collidingObject]});
                explosion.create();
            }
        }
    }
    public render() {
        // for the explosion, it increases its size after every render until a point where it destroys itself and the objectsToDestroy
    }
}