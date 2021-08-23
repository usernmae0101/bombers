import { Container } from "pixi.js";

import * as Shared from "@bombers/shared/src/idnex";
import BaseEntity from "./BaseEntity";
import EntityFactory from "./EntityFactory";

interface IEntityCollector<T> {
    [key: string]: T;
}

export default abstract class BaseContainer<T extends BaseEntity> extends Container {
    protected entities: IEntityCollector<T> = {};
    protected entityIds: number[];

    public abstract update(state: Shared.Interfaces.IGameState, localPlayerColor?: number, dt?: number): void;

    constructor(layer: number, entityIds: number[] = []) {
        super();

        this.width = Shared.Helpers.calculateCanvasWidth();
        this.height = Shared.Helpers.calculateCanvasHeight();
        this.zIndex = layer;

        this.entityIds = entityIds;
    }

    private _updateEntity(
        callbacks: { (entityId: number, position: string): void }[],
        entityId: number, 
        position: string
    ) {
        for (let callback of callbacks) {
            callback(entityId, position);
        }
    }

    private _addEntity(entityId: number, row: number, col: number) {
        const entity: T = EntityFactory.create(entityId);

        entity.setPosition(row, col);
        if ("configurate" in entity)
            // @ts-ignore
            entity.configurate(entityId);
        this.addChild(entity);

        this.entities[`${entityId}${row}${col}`] = entity;
    }

    private _removeEntity(entityId: number, position: string) {
        this.entities[`${entityId}${position}`].destroy();
        delete this.entities[`${entityId}${position}`];
    }

    protected redraw(
        map: number[][][],
        callbacks: { (entityId: number, position: string): void }[] = []
    ) {
        for (let row = 0; row < map.length; row++) {
            for (let col = 0; col < map[row].length; col++) {
                for (let entityId of this.entityIds) {
                    const position = `${row}${col}`;
                    const isEntityExistInColllection = `${entityId}${position}` in this.entities;

                    // если идентификатор, принадлежащий контейнеру, есть на карте
                    if (map[row][col].includes(entityId)) {
                        if (isEntityExistInColllection) {
                            this._updateEntity(callbacks, entityId, position);
                        }

                        else {
                            this._addEntity(entityId, row, col)
                        }
                    }

                    // если нет на карте, но есть в коллекции
                    else if (isEntityExistInColllection) {
                        this._removeEntity(entityId, position);
                    }
                }
            }
        }
    }
}
