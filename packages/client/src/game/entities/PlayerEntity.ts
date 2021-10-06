import { Graphics } from "pixi.js";

import * as Shared from "@bombers/shared/src/idnex";
import { ArrowEntity, EmotionEntity } from ".";
import BaseEntity from "../core/BaseEntity";
import EntityFactory from "../core/EntityFactory";
import { getEntityFrame } from "../core/frames";

const { 
    EntityNumbers, 
    PlayerColors, 
    MoveDirections 
} = Shared.Enums;
const { 
    GAME_RESOLUTION_TILE_SIZE, 
    GAME_RESOLUTION_TILE_OFFSET,
    GAME_RESOLUTION_CANVAS_MARGIN
} = Shared.Constants;

export default class PlayerEntity extends BaseEntity {
    private _color: number;
    private _health: number = null;
    private _healthbar: Graphics;
    private _arrow: ArrowEntity;
    private _emotion: EmotionEntity;

    constructor (frameX: number, frameY: number, color: number) {
        super(frameX, frameY);
        
        this._color = color;
    }

    get color(): number { 
        return this._color;
    }
   
    /**
     * Обновляет полосу здоровья игрока.
     */
    public updateHealthbar(health: number) {
        if (this._health !== health) {
            let hexColor: number;
            let lineLength = GAME_RESOLUTION_TILE_SIZE - GAME_RESOLUTION_CANVAS_MARGIN * 2;

            if (health === 3) {
                hexColor = 0x2CFF00;
            }
            else if (health === 2) {
                hexColor = 0xD3FF00;
                lineLength /= 2;
            }
            else if (health === 1) {
                hexColor = 0xFF0505;
                lineLength /= 3;
            }

            if (this._healthbar !== undefined) {
                this._healthbar.destroy();
            }

            this._healthbar = new Graphics();
            this._healthbar.beginFill(hexColor);
            this._healthbar.drawRect(
                GAME_RESOLUTION_CANVAS_MARGIN, 
                -(GAME_RESOLUTION_CANVAS_MARGIN / 2 + GAME_RESOLUTION_TILE_OFFSET * 2), 
                lineLength, 
                GAME_RESOLUTION_CANVAS_MARGIN / 2
            );
            this._healthbar.endFill();
            this.addChild(this._healthbar);
            this._health = health;
        }
    }

    public updateEmotion(
        emotion: number, 
        direction: number
    ) {
        if (this._emotion !== undefined) {
            this._emotion.destroy();
            this._emotion = undefined;
        } 
        
        if (direction === MoveDirections.UP)
            return;

        this._emotion = EntityFactory.create(emotion);

        if (direction === MoveDirections.LEFT) {
            this._emotion.texture.frame.x += GAME_RESOLUTION_TILE_SIZE / 2;
            this._emotion.texture.frame.width = GAME_RESOLUTION_TILE_SIZE / 2;
            this._emotion.texture.updateUvs();
        }
        
        else if (direction === MoveDirections.RIGHT) {
            this._emotion.texture.frame.width = GAME_RESOLUTION_TILE_SIZE / 2;
            this._emotion.texture.updateUvs();
            this._emotion.x += GAME_RESOLUTION_TILE_SIZE / 2;
        }

        this.addChild(this._emotion);
    }

    public updateArrow() {
        if (this._arrow === undefined) {
            this._arrow = EntityFactory.create(EntityNumbers.ARROW);

            switch (this._color) {
                case PlayerColors.PURPLE:
                case PlayerColors.BLUE:
                    this._arrow.y += GAME_RESOLUTION_TILE_SIZE;
                    this._arrow.x += GAME_RESOLUTION_TILE_OFFSET;
                    break;
                case PlayerColors.YELLOW:
                case PlayerColors.RED:
                    this._arrow.angle = 180;
                    this._arrow.y -= GAME_RESOLUTION_CANVAS_MARGIN;
                    this._arrow.x += GAME_RESOLUTION_TILE_SIZE - GAME_RESOLUTION_TILE_OFFSET;
            }

            this.addChild(this._arrow);
        }

        if (this._arrow.blinkedTimes < 20) 
            this._arrow.blink(15, 0.5);
        else if (!this._arrow.destroyed) 
            this._arrow.destroy(); 
    }

    /**
     * Устанавливает позицию игрока на канвасе.
     * 
     * @param x - позиция по X (левый верхний край спрайта)
     * @param y - позиция по Y (левый верхний край спрайта)
     */
    public setPosition(
        x: number, 
        y: number
    ) {
        this.x = x + GAME_RESOLUTION_TILE_OFFSET + GAME_RESOLUTION_CANVAS_MARGIN;
        this.y = y + GAME_RESOLUTION_TILE_OFFSET + GAME_RESOLUTION_CANVAS_MARGIN;
    }

    /**
     * Меняет фрейм игрока при смене направления движения.
     * 
     * @param direction - направление игрока
     */
    public setDirection(direction: number) {
        const { x, y } = getEntityFrame(EntityNumbers.PLAYER, this._color, direction);

        this.texture.frame.x = x;
        this.texture.frame.y = y;
        this.texture.updateUvs();
    }
}
