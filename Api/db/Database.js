const mongoose = require('mongoose');

let instance = null;
class DataBase {
    constructor() {
        if (!instance) {
            this.mongoConnection = null;
            instance = this; 
        }

        return instance;
    }
    async connect(options) {
        try {
        console.log("Connecting to DataBase...");
        let db = await mongoose.connect(options.CONNECTION_STRING, {usenewUrlParser: true, useUnifiedTopology: true});
        this.mongoConnection = db;
        console.log("Database connected");
            
        } catch (error) {
            console.error("Database connection error:", error);
            process.exit(1);
        }
    }
}

module.exports = DataBase;