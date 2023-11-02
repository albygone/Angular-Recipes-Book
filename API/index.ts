import express, { Express, Request, Response } from 'express';
import { MongoClient } from "mongodb";
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const uri = "mongodb+srv://albygone:legomania05@maincluster.lri6hlm.mongodb.net/";

console.log(process.env);

interface ricetta {
  _id: string;
  descrizione: string;
  ingredienti: string[];
}

if(uri.length > 0){
  const client = new MongoClient(uri);
  
  app.get('/getAll', async (req: Request, res: Response) =>{
  
    try {
      const database = client.db('ricette');
      const movies = database.collection<ricetta>('ricette');
      const query = {};
      const result = await movies.find().toArray();
      res.send(result);
    } finally {
      await client.close();
    }
  });
  
  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });
}