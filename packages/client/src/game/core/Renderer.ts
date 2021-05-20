import BaseContainer from "./BaseContainer";

export default class Renderer {
    constructor (private _containers: BaseContainer[]) {}

    public render() {
        for (let container of this._containers) {
            container.render();
        }
    }
}