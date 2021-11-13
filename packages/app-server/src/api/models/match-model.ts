import mongoose from "mongoose";

import { CounterModel } from "./counter-model";

const matchSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true,
        min: 1
    }, 
    map_id: Number,
    result: [
        {
            nickname: String,
            rating: String,
            points: Number
        }
    ],
    created_at: {
        type: Number,
        default: () => Date.now()
    }
});

matchSchema.pre(
    "save",
    function(next: any) {
        if (!this.isNew) {
            next();
            return;
        }

        CounterModel.increment("matches", this, next);
    }
);

export const MatchModel = mongoose.model("Match", matchSchema);
