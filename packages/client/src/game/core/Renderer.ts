import { Container } from "@pixi/display";
import { IGameState } from "@bombers/shared/src/idnex";

import BaseContainer from "./BaseContainer";
import BaseEntity from "./BaseEntity";

export interface IRenderer {
    init: (stage: Container) => void;
    update: (state: IGameState) => void;
}

export class Renderer implements IRenderer {
    private _containers: BaseContainer<BaseEntity>[];

    constructor(containers: BaseContainer<BaseEntity>[]) {
        this._containers = containers;
    }

    public init(stage: Container) {
        stage.sortableChildren = true;

        for (let container of this._containers) {
            stage.addChild(container);
        }
    }

    public update(state: IGameState) {
        for (let container of this._containers) {
            container.update(state);
        }
    }
}