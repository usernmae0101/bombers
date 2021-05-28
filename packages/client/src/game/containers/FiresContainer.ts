import BaseContainer from "../core/BaseContainer";
import * as Shared from "@bombers/shared/src/idnex";
import { FireEntity } from "../entities";
import EntityFactory from "../core/EntityFactory";

const { EntityNumbers, ContainerLayers } = Shared.Enums;

interface IMiddleBuffer {
    [key: string]: FireEntity
}

export default class FiresContainer extends BaseContainer<FireEntity> {
    private _middleBuffer: IMiddleBuffer = {};

    constructor() {
        super(
            ContainerLayers.FIRES,
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
                    this.tryToRemoveEntity(row, col);
                    this.tryToAddEntity(EntityNumbers.FIRE_CENTER, row, col);
                }
                return true;
            }
        }

        return false;
    }

    public update(state: Shared.Interfaces.IGameState) {
        this.redraw(
            state.map,
            [
                this._drawMiddleIfExist,
                this._replaceCrossEdgesFlamesByCenter
            ]
        );
    }
}