import { BaseTexture, Rectangle, Sprite, Texture } from "pixi.js";

export default abstract class BaseEntity extends Sprite {
    constructor (resource: string, frame?: Rectangle) {
        super(
            new Texture(
                BaseTexture.from(resource),
                frame
            )
        );
    }
    
    setPosition(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}