export interface IInputKeys {
    [code: string]: boolean;
}

export default class Inputs {
    static keys: IInputKeys = {};
    static locked: IInputKeys = {};

    static handle(event: KeyboardEvent) {
        const isKeyPressed = event.type === "keydown";

        !isKeyPressed && (Inputs.locked[event.code] = false);
        Inputs.keys[event.code] = isKeyPressed;
    }

    static subscribe() {
        document.addEventListener("keydown", Inputs.handle);
        document.addEventListener("keyup", Inputs.handle);
    }

    static unsubscribe() {
        document.removeEventListener("keydown", Inputs.handle);
        document.removeEventListener("keyup", Inputs.handle);
    }
}