import express, { Express, Request, Response, json } from 'express';
import { MongoClient, ObjectId, Timestamp } from 'mongodb';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

dotenv.config();

const app: Express = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const port = process.env.PORT;
const uri = process.env.CNSTRING ?? '';

type ingredient = {
  name: string;
  quantity: number;
  unit: string;
};

type recipe = {
  _id: string;
  description: string;
  difficulty: number;
  timeSpan: Timestamp;
  imageUrl: string;
  steps: string[];
  ingredients: ingredient[];
};

if (uri.length > 0) {
  app.get('/getAll', async (req: Request, res: Response) => {
    const client = new MongoClient(uri);

    try {
      const database = client.db('ricette');
      const recipes = database.collection<recipe>('ricette');

      const result = await recipes.find().toArray();
      res.send(result);
    } finally {
      await client.close();
    }
  });

  app.get('/getSingle', async (req: Request, res: Response) => {
    const client = new MongoClient(uri);

    try {
      const database = client.db('ricette');
      const recipes = database.collection<recipe>('ricette');

      const query: any = {};

      for (const key in req.query)
        query[key] =
          key == '_id'
            ? new ObjectId(req.query[key]?.toString()) ?? ''
            : req.query[key];

      const result = await recipes.find(query).toArray();

      res.send(result);
    } finally {
      await client.close();
    }
  });

  app.post('/insertSingle', async (req: Request, res: Response) => {
    const client = new MongoClient(uri);

    try {
      const database = client.db('ricette');
      const recipes = database.collection<recipe>('ricette');

      recipes.insertOne(req.body);

      res.send('ok');
    } finally {
      await client.close();
    }
  });

  app.post('/insertMultiple', async (req: Request, res: Response) => {
    const client = new MongoClient(uri);

    try {
      const database = client.db('ricette');
      const recipes = database.collection<recipe>('ricette');

      recipes.insertMany(req.body);

      res.send('ok');
    } finally {
      await client.close();
    }
  });

  app.post('/update', async (req: Request, res: Response) => {
    const client = new MongoClient(uri);

    try {
      const database = client.db('ricette');
      const recipes = database.collection<recipe>('ricette');

      const id: any = new ObjectId(req.body._id ?? '');

      delete req.body._id;

      recipes.updateOne({ _id: id }, { $set: req.body });
      res.send('ok');
    } finally {
      await client.close();
    }
  });

  app.post('/delete', async (req: Request, res: Response) => {
    const client = new MongoClient(uri);

    try {
      const database = client.db('ricette');
      const recipes = database.collection<recipe>('ricette');

      const filter = req.body;

      if (req.body._id !== undefined) filter._id = new ObjectId(req.body._id);

      recipes.deleteOne(filter);

      res.send('ok');
    } finally {
      await client.close();
    }
  });

  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at port ${port}`);
  });
}
