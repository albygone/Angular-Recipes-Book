"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
const uri = "mongodb+srv://albygone:legomania05@maincluster.lri6hlm.mongodb.net/";
console.log(process.env);
if (uri.length > 0) {
    const client = new mongodb_1.MongoClient(uri);
    app.get('/getAll', async (req, res) => {
        try {
            const database = client.db('ricette');
            const movies = database.collection('ricette');
            const query = {};
            const result = await movies.find().toArray();
            res.send(result);
        }
        finally {
            await client.close();
        }
    });
    app.listen(port, () => {
        console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    });
}
