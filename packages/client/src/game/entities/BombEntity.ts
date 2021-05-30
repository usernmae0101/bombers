import BaseEntity from "../core/BaseEntity";
import * as Shared from "@bombers/shared/src/idnex";

const { GAME_RESOLUTION_TILE_OFFSET } = Shared.Constants;

export default class BombEntity extends BaseEntity {
    private _isMakeBombBigger: boolean = false;

    constructor(frameX: number, frameY: number) {
        super(frameX, frameY);
    }

    public pulse() {
        if (++this.tick % 20 !== 0)
            return;

        const scale = GAME_RESOLUTION_TILE_OFFSET;

        this.width += this._isMakeBombBigger ? scale : -scale;
        this.x += this._isMakeBombBigger ? -(scale / 2) : (scale / 2);

        this.height += this._isMakeBombBigger ? scale : -scale;
        this.y += this._isMakeBombBigger ? -(scale / 2) : (scale / 2);

        this._isMakeBombBigger = !this._isMakeBombBigger;
    }
}