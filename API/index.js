"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const setHeaders = (res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,PUT, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
};
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({
    extended: true,
}));
app.use((req, res, next) => {
    setHeaders(res);
    next();
});
const port = process.env.PORT;
const uri = process.env.CNSTRING ?? '';
if (uri.length > 0) {
    app.get('/getAll', async (req, res) => {
        const client = new mongodb_1.MongoClient(uri);
        try {
            const database = client.db('ricette');
            const recipes = database.collection('ricette');
            const result = await recipes.find().toArray();
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.send(result);
        }
        finally {
            await client.close();
        }
    });
    app.get('/getFilter', async (req, res) => {
        const client = new mongodb_1.MongoClient(uri);
        try {
            const database = client.db('ricette');
            const recipes = database.collection('ricette');
            const query = {};
            for (const key in req.query)
                query[key] =
                    key == '_id'
                        ? new mongodb_1.ObjectId(req.query[key]?.toString()) ?? ''
                        : req.query[key];
            const result = await recipes.find(query).toArray();
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.send(result);
        }
        finally {
            await client.close();
        }
    });
    app.get('/check', async (req, res) => {
        const client = new mongodb_1.MongoClient(uri);
        try {
            const database = client.db('ricette');
            const recipes = database.collection('ricette');
            const query = {};
            let result;
            if (req.query._id != '' && req.query._id != undefined) {
                for (const key in req.query)
                    query[key] =
                        key == '_id'
                            ? new mongodb_1.ObjectId(req.query[key]?.toString()) ?? ''
                            : req.query[key];
                result = recipes.findOne(query);
            }
            else {
                result = new Promise((resolve) => resolve(null));
            }
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.send(await result != null);
        }
        finally {
            await client.close();
        }
    });
    app.post('/insertSingle', async (req, res) => {
        const client = new mongodb_1.MongoClient(uri);
        try {
            const database = client.db('ricette');
            const recipes = database.collection('ricette');
            recipes.insertOne(req.body);
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.send('ok');
        }
        finally {
            await client.close();
        }
    });
    app.post('/insertMultiple', async (req, res) => {
        const client = new mongodb_1.MongoClient(uri);
        try {
            const database = client.db('ricette');
            const recipes = database.collection('ricette');
            recipes.insertMany(req.body);
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.send('ok');
        }
        finally {
            await client.close();
        }
    });
    app.post('/update', async (req, res) => {
        const client = new mongodb_1.MongoClient(uri);
        try {
            const database = client.db('ricette');
            const recipes = database.collection('ricette');
            const id = new mongodb_1.ObjectId(req.body._id ?? '');
            delete req.body._id;
            recipes.updateOne({ _id: id }, { $set: req.body });
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.send('ok');
        }
        finally {
            await client.close();
        }
    });
    app.post('/delete', async (req, res) => {
        const client = new mongodb_1.MongoClient(uri);
        try {
            const database = client.db('ricette');
            const recipes = database.collection('ricette');
            const filter = req.body;
            if (req.body._id !== undefined)
                filter._id = new mongodb_1.ObjectId(req.body._id);
            recipes.deleteOne(filter);
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.send('ok');
        }
        finally {
            await client.close();
        }
    });
    app.listen(port, () => {
        console.log(`⚡️[server]: Server is running at port ${port}`);
    });
}
