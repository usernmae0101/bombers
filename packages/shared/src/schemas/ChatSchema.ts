import { type, Schema, ArraySchema } from "@colyseus/schema";

export interface IMessage {
    author: string;
    avatar: string;
    message: string;
    date: number;
}

export interface IMember {
    nickname: string;
}

export class Message extends Schema {
    @type("string")
    author: string;

    @type("string")
    message: string;

    @type("string")
    avatar: string;

    @type("number")
    date: number;

    constructor(message: IMessage) {
        super();

        this.message = message.message;
        this.author = message.author;
        this.avatar = message.avatar;
        this.date = message.date;
    }
}

export class Member extends Schema {
    @type("string")
    nickname: string;

    constructor(member: IMember) {
        super();

        this.nickname = member.nickname;
    }
}

export class ChatState extends Schema {
    @type([ Message ])
    messages = new ArraySchema<Message>();

    @type([ Member ])
    members = new ArraySchema<Member>();
}
