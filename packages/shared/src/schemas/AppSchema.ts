import { type, Schema } from "@colyseus/schema";

class OnlineSchema extends Schema {
    @type("number")
    game: number = 0;

    @type("number")
    chat: number = 0;
}

export class AppState extends Schema {
    @type(OnlineSchema)
    online: OnlineSchema = new OnlineSchema();
}