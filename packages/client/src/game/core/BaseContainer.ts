import { Container } from "pixi.js";

import * as Shared from "@bombers/shared/src/idnex";
import BaseEntity from "./BaseEntity";
import EntityFactory from "./EntityFactory";

// FIXME: переписать. код плохо написан (сложно, неправильно). упростить

export default abstract class BaseContainer<T extends BaseEntity> extends Container {
    protected entities: T[][] = [];
    protected current_entity_id: number[][] = [];
    protected entity_ids: number[];
    private _priority_id: number;

    public abstract update(state?: Shared.Interfaces.IGameState): void;

    constructor(layer: number, entity_ids: number[] = [], priority_id?: number) {
        super();

        super.width = Shared.Common.calculateCanvasWidth();
        super.height = Shared.Common.calculateCanvasHeight();

        this.zIndex = layer;
        this.entity_ids = entity_ids;
        this._priority_id = priority_id;
    }

    protected tryToAddEntity(entity_id: number, row: number, col: number) {
        if (!this.entities[row][col]) {
            const entity: T = EntityFactory.create(entity_id);

            entity.setPosition(row, col);
            this.addChild(entity);

            this.current_entity_id[row][col] = entity_id;
            this.entities[row][col] = entity;
        }
    }

    protected tryToRemoveEntity(row: number, col: number) {
        if (this.entities[row][col]) {
            this.entities[row][col].destroy();
            this.current_entity_id[row][col] = null;
            delete this.entities[row][col];
        }
    }

    protected redraw(
        map: number[][][],
        callbacks: { (mapEntities: number[], row: number, col: number): boolean }[] = []
    ) {
        for (let row = 0; row < map.length; row++) {
            if (!this.entities[row]) this.entities[row] = [];
            if (!this.current_entity_id[row]) this.current_entity_id[row] = [];

            for (let col = 0; col < map[row].length; col++) {
                // логика контейнера
                let isContinue = false;
                for (let callback of callbacks)
                    if (isContinue = callback(map[row][col], row, col))
                        break;
                if (isContinue) continue;

                // перерисовываем, если указана приоритетная сущность
                if (map[row][col].includes(this._priority_id)) {
                    if (this._priority_id === this.current_entity_id[row][col])
                        continue;

                    this.tryToRemoveEntity(row, col);
                    this.tryToAddEntity(this._priority_id, row, col);
                    continue;
                }

                let entity_id = undefined;

                // ищем сущности для этого конейнера на карте
                for (let _entity_id of this.entity_ids) {
                    if (map[row][col].includes(_entity_id)) {
                        entity_id = _entity_id;
                        break;
                    }
                }

                if (entity_id !== undefined)
                    this.tryToAddEntity(entity_id, row, col);
                else 
                	this.tryToRemoveEntity(row, col);
            }
        }
    }
}
