import mongoose from "mongoose";

export type SocialType = "vk" | "ok" | "fb";

export interface IUser extends mongoose.Document {
    uid: number;
    nickname: string;
    rating: number;
    avatar: string;
    social: SocialType;
}

interface IUserModel extends mongoose.Model<IUser> {
    findBySocialVk: (uid: number) => Promise<IUser>;
}
 
const UserSchema = new mongoose.Schema({
    uid: { type: Number, required: true, unique: true },
    nickname: { type: String, required: true, uniquie: true, minlength: 5, maxlength: 12 },
    rating: { type: Number, default: 1000 },
    avatar: { type: String, default: "https://pbs.twimg.com/media/C3xDj9gWMAA0mBS.jpg" },
    social: { type: String, enum: ["vk", "ok", "fb"] },
    created_at: { type: Date, default: Date.now }
});

UserSchema.statics.findBySocialVk = function(uid) {
    return this.findOne({ social: "vk", uid: uid });
}

export const UserModel = mongoose.model<IUser, IUserModel>("User", UserSchema);
