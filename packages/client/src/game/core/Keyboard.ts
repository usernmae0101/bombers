export interface IKeyboardKeys {
    /** Состояние клавиш. */
    [code: string]: boolean;
}

export default class Keyboard {
    /** Состояние клавиш: нажата или нет. */
    public static keys: IKeyboardKeys = {};
    /** Состояние клавиш: заблокирована или нет. */
    public static locked: IKeyboardKeys = {};

    public static handle(event: KeyboardEvent) {
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
        document.addEventListener("keydown", Keyboard.handle);
        document.addEventListener("keyup", Keyboard.handle);
    }

    /**
     * Отписывается от обработки клавиш.
     */
    public static unsubscribe() {
        document.removeEventListener("keydown", Keyboard.handle);
        document.removeEventListener("keyup", Keyboard.handle);
    }
}
