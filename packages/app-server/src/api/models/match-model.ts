import mongoose from "mongoose";

import { CounterModel } from "./counter-model";

const resultSchema = new mongoose.Schema(
    {
        nickname: String,
        rating: Number,
        points: Number,
        place: Number
    },
    {
        _id: false
    }
);

const matchSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true,
        min: 1
    }, 
    map_id: Number,
    result: [resultSchema],
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
