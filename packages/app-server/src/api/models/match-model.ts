import mongoose from "mongoose";

import { CounterModel } from "./counter-model";

const matchSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true,
        min: 1
    }, 
    created_at: {
        type: Date,
        default: Date.now
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
