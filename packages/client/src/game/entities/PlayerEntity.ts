import { Rectangle } from "@pixi/math";
import { Graphics } from "@pixi/graphics";

import { EntityNumbers, GAME_RESOLUTION_TILE_OFFSET, GAME_RESOLUTION_TILE_SIZE, getEntityFrame, PlayerColors, RESOURCE_IMAGE_PATH_TILEMAP } from "@bombers/shared/src/idnex";
import BaseEntity from "../core/BaseEntity";
import ArrowEntity from "./ArrowEntity";
import EntityFactory from "../core/EntityFactory";

export default class PlayerEntity extends BaseEntity {
    private _color: number;
    private _frame: Rectangle;
    private _tick: number = 0;
    private _health: number = null;
    private _healthbar: Graphics = undefined;
    private _arrow: ArrowEntity = undefined;

    constructor(color: number, frame: Rectangle) {
        super(
            RESOURCE_IMAGE_PATH_TILEMAP,
            frame,
            GAME_RESOLUTION_TILE_SIZE - GAME_RESOLUTION_TILE_OFFSET,
            GAME_RESOLUTION_TILE_SIZE - GAME_RESOLUTION_TILE_OFFSET
        );

        this._frame = frame;
        this._color = color;
    }

    set tick(value: number) {
        this._tick = value;
    }

    get color(): number {
        return this._color;
    }

    blink() {
        if (++this._tick > 10) {
            this.alpha = this.alpha === 1 ? 0 : 1;
            this._tick = 0;
        }
    }

    updateArrow(tick: number) {
        if (tick > 500) {
            if (this._arrow !== undefined) {
                this._arrow.destroy();
                this._arrow = undefined;
            }
            return;
        }

        if (this._arrow === undefined) {
            this._arrow = EntityFactory.create(EntityNumbers.ARROW);

            switch (this._color) {
                case PlayerColors.RED:
                case PlayerColors.BLUE:
                    this._arrow.y += GAME_RESOLUTION_TILE_SIZE + GAME_RESOLUTION_TILE_OFFSET;
                    this._arrow.x += GAME_RESOLUTION_TILE_OFFSET;
                    break;
                case PlayerColors.YELLOW:
                case PlayerColors.PURPLE:
                    this._arrow.angle = 180;
                    this._arrow.y -= GAME_RESOLUTION_TILE_OFFSET;
                    this._arrow.x += GAME_RESOLUTION_TILE_SIZE - GAME_RESOLUTION_TILE_OFFSET;
            }

            this.addChild(this._arrow);
        }

        this._arrow.blink();
    }

    setHealthbar(health: number) {
        if (this._health !== health) {
            let hexColor: number;
            let lineLength: number;

            if (health === 3) {
                hexColor = 0x2CFF00;
                lineLength = GAME_RESOLUTION_TILE_SIZE;
            }
            else if (health === 2) {
                hexColor = 0xD3FF00;
                lineLength = GAME_RESOLUTION_TILE_SIZE / 2;
            }
            else if (health === 1) {
                hexColor = 0xFF0505;
                lineLength = GAME_RESOLUTION_TILE_SIZE / 3;
            }

            if (this._healthbar !== undefined) {
                this._healthbar.destroy();
            }

            this._healthbar = new Graphics();
            this._healthbar.beginFill(hexColor);
            this._healthbar.drawRect(
                GAME_RESOLUTION_TILE_OFFSET,
                0,
                lineLength - GAME_RESOLUTION_TILE_OFFSET,
                GAME_RESOLUTION_TILE_OFFSET / 2
            );
            this._healthbar.endFill();
            this._healthbar.y -= 2;
            this.addChild(this._healthbar);

            this._health = health;
        }
    }

    setPosition(x: number, y: number) {
        this.x = x + GAME_RESOLUTION_TILE_OFFSET / 2;
        this.y = y + GAME_RESOLUTION_TILE_OFFSET / 2;
    }

    setDirection(direction: number) {
        const { x: frameX, y: frameY } = getEntityFrame(EntityNumbers.PLAYER, this._color, direction);

        this._frame.x = frameX;
        this._frame.y = frameY;
        this.texture.updateUvs();
    }
}