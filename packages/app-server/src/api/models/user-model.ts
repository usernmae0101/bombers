import mongoose from "mongoose";

import { CounterModel } from "./counter-model";

export interface IDocumentUser extends mongoose.Document {
    /** Идентификатор пользователя в социальной сети. */
    uid?: number;
    /**  Никнейм пользователя. */
    nickname: string;
    /** Идентификатор пользователя в базе данных. */
    id: number;
    /** Рейтинг пользователя. */
    rating: number;
    /**  Аватар пользователя. URL. */
    avatar: string;
    /** Тип социальной сети: "vk" | "fb" | "ok". */
    social?: "vk" | "ok" | "fb";
    /** ВременнАя метка создания аккаунта. */
    created_at: number;
    /** ВременнАя метка последнего посещения. */
    last_seen: number;
    /** Находится ли пользователь сейчас на сайте. */
    is_online: boolean;
}

const userSchema = new mongoose.Schema({
    uid: { 
        type: Number, 
        unique: true 
    },
    id: {
        type: Number,
        unique: true,
        min: 1
    }, 
    nickname: {
        type: String,
        required: true,
        unique: true,
        dropDups: true,
        minlength: 5,
        maxlength: 20
    },
    is_online: { 
        type: Boolean,
        default: true 
    },
    last_seen: { 
        type: Number, 
        default: () => Date.now() 
    },
    rating: { 
        type: Number, 
        default: 1000, 
        min: 0 
    },
    avatar: { 
        type: String, 
        default: "https://pbs.twimg.com/media/C3xDj9gWMAA0mBS.jpg" 
    },
    social: { 
        type: String, 
        enum: ["vk", "ok", "fb"] 
    },
    created_at: { 
        type: Number, 
        default: () => Date.now() 
    }
});

userSchema.pre(
    "save",
    function(next: any) {
        if (!this.isNew) {
            next();
            return;
        }

        CounterModel.increment("users", this, next);
    }
);

userSchema.static(
    "findByNickname", 
    function(nickname: string) {
        return this.findOne({ nickname });
    }
);

export const UserModel = mongoose.model<IDocumentUser>("User", userSchema);
