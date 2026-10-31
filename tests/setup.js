const mongoose = require("mongoose");
const os = require("os");

beforeAll(async () => {
    await mongoose.connect(process.env.TEST_MONGO_URI, {
        runtimeAdapters: {
            os: os
        }
    });
});

afterEach(async () => {
    const collections = mongoose.connection.collections;

    for (const key of Object.keys(collections)) {
        await collections[key].deleteMany({});
    }
});

afterAll(async () => {
    await mongoose.connection.close();
});