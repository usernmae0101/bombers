import { ContainterLayers, EntityNumbers, IGameState } from "@bombers/shared/src/idnex";
import BaseContainer from "../core/BaseContainer";
import FireEntity from "../entities/FireEntity";

export default class FiresContainer extends BaseContainer<FireEntity> {
    constructor() {
        super(
            ContainterLayers.FIRE,
            [
                EntityNumbers.FIRE_CENTER, EntityNumbers.FIRE_BOTTOM,
                EntityNumbers.FIRE_LEFT, EntityNumbers.FIRE_TOP, 
                EntityNumbers.FIRE_RIGHT
            ],
            EntityNumbers.FIRE_CENTER
        );
    }

    private _replaceCrossFlamesByCenter = (mapEntities: number[], row: number, col: number): boolean => {
        let counter = 0;

        const edges = [
            EntityNumbers.FIRE_BOTTOM, EntityNumbers.FIRE_LEFT, 
            EntityNumbers.FIRE_TOP, EntityNumbers.FIRE_RIGHT
        ];

        const exclude: number[] = [];

        for (let edge of edges) {
            if (mapEntities.includes(edge) && !exclude.includes(edge)) {
                exclude.push(edge);
                ++counter;
            }

            if (counter > 1) {
                if (this.current_entity_id[row][col] !== EntityNumbers.FIRE_CENTER) {
                    this.removeEntity(row, col);
                    this.addEntity(EntityNumbers.FIRE_CENTER, row, col);
                }
                return true;
            }
        }
               
        return false;
    }

    update(state: IGameState) {
        this.updateMap(state.map, [this._replaceCrossFlamesByCenter]);
    }
}