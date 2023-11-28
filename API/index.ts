import express, { Express, Request, Response} from 'express';
import { MongoClient, ObjectId, Timestamp, WithId} from 'mongodb';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

dotenv.config();

const app: Express = express();

const setHeaders = (res: Response) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
}

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use( (req, res, next) => {
  setHeaders(res);
  next();
});

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

      res.setHeader('Access-Control-Allow-Origin', '*');
      res.send(result);
    } finally {
      await client.close();
    }
  });

  app.get('/getFilter', async (req: Request, res: Response) => {
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

      res.setHeader('Access-Control-Allow-Origin', '*');
      res.send(result);
    } finally {
      await client.close();
    }
  });

  app.get('/check', async (req: Request, res: Response) => {
    const client = new MongoClient(uri);

    try {
      const database = client.db('ricette');
      const recipes = database.collection<recipe>('ricette');

      const query: any = {};
      let result: Promise<WithId<recipe> | null>;

      if(req.query._id != '' && req.query._id != undefined) {
        for (const key in req.query)
          query[key] =
            key == '_id'
              ? new ObjectId(req.query[key]?.toString()) ?? ''
              : req.query[key];
  
        result = recipes.findOne(query);
      }else{
        result = new Promise((resolve) => resolve(null));
      }
      res.setHeader('Access-Control-Allow-Origin', '*');

      res.send(await result != null);
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

      res.setHeader('Access-Control-Allow-Origin', '*');
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

      res.setHeader('Access-Control-Allow-Origin', '*');
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

      res.setHeader('Access-Control-Allow-Origin', '*');
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

      res.setHeader('Access-Control-Allow-Origin', '*');
      res.send('ok');
    } finally {
      await client.close();
    }
  });

  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at port ${port}`);
  });
}
