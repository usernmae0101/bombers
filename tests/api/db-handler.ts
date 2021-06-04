import mongoose from "mongoose";

export const dbConnection = async () => {
    await mongoose.connect('mongodb://localhost:27017/test_bombers', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
};

export const closeDatabase = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
};

export const clearDatabase = async () => {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
    }
};