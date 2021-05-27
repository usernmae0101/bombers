export interface IKeyboardKeys {
    /** Состояние клавиш. */
    [code: string]: boolean;
}

export default class Keyboard {
    /** Состояние клавиш: нажата или нет. */
    public static keys: IKeyboardKeys = {};
    /** Состояние клавиш: заблокирована или нет. */
    public static locked: IKeyboardKeys = {};

    private static _handle(event: KeyboardEvent) {
        const isKeyPressed = event.type === "keydown";

        // снимаем блокировку с клавиши, если отпущена
        if (!isKeyPressed)
            Keyboard.locked[event.code] = false;
        
        // устанавливем состояние клавиши
        Keyboard.keys[event.code] = isKeyPressed;
    }

    /**
     * Подписывается на обрабоку клавиш.
     */
    public static subscribe() {
        document.addEventListener("keydown", this._handle);
        document.addEventListener("keyup", this._handle);
    }

    /**
     * Отписывается от обработки клавиш.
     */
    public static unsubscribe() {
        document.removeEventListener("keydown", this._handle);
        document.removeEventListener("keyup", this._handle);
    }
}
