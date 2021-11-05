import mongoose from "mongoose";

const matchSchema = new mongoose.Schema({
    players: [String],
    map_id: Number,
    result: [
        {
            nickname: String,
            points: Number
        }
    ],
    created_at: {
        type: Date,
        default: Date.now
    }
});

export const MatchModel = mongoose.model("Match", matchSchema);
