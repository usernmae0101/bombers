import mongoose from "mongoose";

interface ICounterModel extends mongoose.Model<{}> {
    increment: (a: string, b: any, c: any) => void;
}

const counterSchema = new mongoose.Schema<{}, ICounterModel>(
    {
        name: { 
            type: String, 
            unique: true 
        },
        seq: { 
            type: Number, 
            default: 0 
        }
    }, 
    { 
        _id: false 
    }
);

counterSchema.index(
    { 
        name: 1, 
        seq: 1 
    }, 
    { 
        unique: true 
    }
);

counterSchema.static(
    "increment", 
    function(
        modelName: string, 
        doc: any,
        next: any
    ) {
        return this.findOneAndUpdate(
            { 
                name: modelName 
            },
            { 
                $inc: { 
                    seq: 1 
                } 
            },
            {
                new: true,
                upsert: true
            },
            function(error: any, counter: any) {
                if (error) 
                    return next(error);

                doc.id = counter.seq;
                next();
            }
        );
    }
);

export const CounterModel = mongoose.model<{}, ICounterModel>("Counter", counterSchema);
