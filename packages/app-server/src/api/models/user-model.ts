import mongoose from "mongoose";

export interface IDocumentUser extends mongoose.Document {
    /** Идентификатор пользователя в социальной сети. */
    uid?: number;
    /**  Никнейм пользователя. */
    nickname: string;
    /** Рейтинг пользователя. */
    rating: number;
    /**  Аватар пользователя. URL. */
    avatar: string;
    /** Тип социальной сети: "vk" | "fb" | "ok". */
    social?: "vk" | "ok" | "fb";
}

const UserSchema = new mongoose.Schema({
    uid: {
        type: Number,
        required: true,
        unique: true
    },
    nickname: {
        type: String,
        required: true,
        uniquie: true,
        minlength: 5,
        maxlength: 20
    },
    rating: {
        type: Number,
        default: 1000
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
        type: Date,
        default: Date.now
    }
});

export const UserModel = mongoose.model<IDocumentUser>("User", UserSchema);
