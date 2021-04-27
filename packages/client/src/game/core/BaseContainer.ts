import { Container } from "pixi.js";

import { GAME_RESOLUTION_HEIGHT, GAME_RESOLUTION_WIDTH, IGameState } from "@bombers/shared/src/idnex";
import BaseEntity from "./BaseEntity";
import EntityFactory from "./EntityFactory";

export default abstract class BaseContainer<T extends BaseEntity> extends Container {
    protected entities: T[][] = [];
    protected current_entity_id: number[][] = [];
    protected entity_ids: number[];
    private _priority_id: number;

    constructor(layer: number, entity_ids: number[] = [], priority_id?: number) {
        super();

        super.width = GAME_RESOLUTION_WIDTH;
        super.height = GAME_RESOLUTION_HEIGHT;

        this.zIndex = layer;
        this.entity_ids = entity_ids;
        this._priority_id = priority_id;
    }

    abstract update(state?: IGameState): void;

    protected addEntity(entity_id: number, row: number, col: number) {
        if (!this.entities[row][col]) {
            const entity: T = EntityFactory.create(entity_id);

            entity.setPosition(row, col);
            entity.configurate();
            this.addChild(entity);

            this.current_entity_id[row][col] = entity_id;
            this.entities[row][col] = entity;
        }
    }

    protected removeEntity(row: number, col: number) {
        if (this.entities[row][col]) {
            this.entities[row][col].destroy();
            this.current_entity_id[row][col] = null;
            delete this.entities[row][col];
        }
    }

    protected updateMap(map: number[][][], callbacks: { (mapEntities: number[], row: number, col: number): boolean }[] = []) {
        for (let row = 0; row < map.length; row++) {
            if (!this.entities[row]) this.entities[row] = [];
            if (!this.current_entity_id[row]) this.current_entity_id[row] = [];

            for (let col = 0; col < map[row].length; col++) {
                // individual container logic for the current set of entiteis
                let isContinue = false;
                for (let callback of callbacks) 
                    if (isContinue = callback(map[row][col], row, col))
                        break;
                if (isContinue) continue;

                // overwrite sprite by highest priority, if it is set
                if (map[row][col].includes(this._priority_id)) {
                    if (this._priority_id === this.current_entity_id[row][col]) 
                        continue;
                    
                    this.removeEntity(row, col);
                    this.addEntity(this._priority_id, row, col);   
                    continue; 
                }

                let entity_id = undefined;

                // try to find one of these entities on the map
                for (let _entity_id of this.entity_ids) {
                    if (map[row][col].includes(_entity_id)) {
                        entity_id = _entity_id;
                        break;
                    }
                }

                if (entity_id !== undefined) 
                    this.addEntity(entity_id, row, col); 
                else this.removeEntity(row, col);
            } 
        }
    }
}
