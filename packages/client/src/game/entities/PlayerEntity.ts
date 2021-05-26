import * as Shared from "@bombers/shared/src/idnex";
import { ArrowEntity } from ".";
import BaseEntity from "../core/BaseEntity";
import EntityFactory from "../core/EntityFactory";
import { getEntityFrame } from "../core/frames";

const { EntityNumbers, PlayerColors } = Shared.Enums;

export default class PlayerEntity extends BaseEntity {
    private _color: number;
    private _arrow: ArrowEntity;

    constructor(frameX: number, frameY: number, color: number) {
        super(frameX, frameY);

        this._color = color;
    }

    get color(): number { 
        return this._color;
    }
    
    // TODO:
    public updateHealthbar() {

    }
    
    public updateArrow() {
        const { GAME_RESOLUTION_TILE_SIZE } = Shared.Constants;

        if (this._arrow === undefined) {
            this._arrow = EntityFactory.create(EntityNumbers.ARROW);

            switch (this._color) {
                case PlayerColors.PURPLE:
                case PlayerColors.BLUE:
                    this._arrow.y += GAME_RESOLUTION_TILE_SIZE;
                    break;
                case PlayerColors.YELLOW:
                case PlayerColors.RED:
                    this._arrow.angle = 180;
                    this._arrow.x += GAME_RESOLUTION_TILE_SIZE;
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
    public setPosition(x: number, y: number) {
        this.x = x;
        this.y = y;
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
