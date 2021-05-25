import { Container } from "@pixi/display";

import * as Shared from "@bombers/shared/src/idnex";
import BaseContainer from "./BaseContainer";
import BaseEntity from "./BaseEntity";

export default class Renderer {
    constructor(private _containers: BaseContainer<BaseEntity>[]) { }

    /**
     * Инициализация перед началом отрисовки.
     * 
     * @param stage - главная сцена канваса
     */
    public init(stage: Container) {
        stage.sortableChildren = true;

        for (let container of this._containers)
            stage.addChild(container);
    }

    /**
     * Отрисовывает каждый контейнер на сцене.
     * 
     * @param state - игровое состояние
     * @param localPlayerColor - цвет локального игрока
     */
    public render(state: Shared.Interfaces.IGameState, localPlayerColor: number) {
        for (let container of this._containers)
            container.update(state, localPlayerColor);
    }
}