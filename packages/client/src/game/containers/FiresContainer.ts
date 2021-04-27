import { ContainterLayers, EntityNumbers, GAME_RESOLUTION_TILE_LENGTH_X, GAME_RESOLUTION_TILE_LENGTH_Y, GAME_RESOLUTION_TILE_OFFSET, GAME_RESOLUTION_TILE_SIZE, IGameState } from "@bombers/shared/src/idnex";
import BaseContainer from "../core/BaseContainer";
import EntityFactory from "../core/EntityFactory";
import FireEntity from "../entities/FireEntity";

export default class FiresContainer extends BaseContainer<FireEntity> {
    private _middleBuffer: { [key: string]: FireEntity } = {};

    constructor() {
        super(
            ContainterLayers.FIRE,
            [
                EntityNumbers.FIRE_CENTER,
                EntityNumbers.FIRE_BOTTOM,
                EntityNumbers.FIRE_LEFT,
                EntityNumbers.FIRE_TOP,
                EntityNumbers.FIRE_RIGHT,
                EntityNumbers.FIRE_MIDDLE_X,
                EntityNumbers.FIRE_MIDDLE_Y
            ],
            EntityNumbers.FIRE_CENTER
        );
    }

    private _drawMiddleIfExist = (mapEntities: number[], row: number, col: number): boolean => {
        const position = `${row}${col}`;

        for (let middle_entity of [EntityNumbers.FIRE_MIDDLE_X, EntityNumbers.FIRE_MIDDLE_Y]) {
            const bufferSlot = this._middleBuffer[`${middle_entity}${position}`];

            if (mapEntities.includes(middle_entity)) {
                if (this.current_entity_id[row][col] !== middle_entity && bufferSlot === undefined) {
                    const entity = EntityFactory.create(middle_entity);

                    entity.setPosition(row, col);
                    entity.configurate();

                    this.addChild(entity);
                    this._middleBuffer[`${middle_entity}${position}`] = entity;
                }
            } else if (bufferSlot !== undefined) {
                bufferSlot.destroy();
                delete this._middleBuffer[`${middle_entity}${position}`];
            }
        }

        return false;
    }

    private _replaceCrossEdgesFlamesByCenter = (mapEntities: number[], row: number, col: number): boolean => {
        let counter = 0;

        const edges = [
            EntityNumbers.FIRE_BOTTOM,
            EntityNumbers.FIRE_LEFT,
            EntityNumbers.FIRE_TOP,
            EntityNumbers.FIRE_RIGHT
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
        this.updateMap(
            state.map,
            [
                this._drawMiddleIfExist,
                this._replaceCrossEdgesFlamesByCenter
            ]
        );
    }
}
