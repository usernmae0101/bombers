import { ContainterLayers } from "@bombers/shared/src/idnex"
import BaseContainer from "../core/BaseContainer"
import GrassEntity from "../entities/GrassEntity"

export default class GrassContainer extends BaseContainer<GrassEntity> {
    private _hasDrawn: boolean = false;
    
    constructor() {
        super(ContainterLayers.GRASS);
    }

    update() {
        if (!this._hasDrawn) {
            this.addChild(new GrassEntity);
            this._hasDrawn = true;
        }
    }
}