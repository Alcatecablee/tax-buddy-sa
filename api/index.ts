import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import { registerRoutes } from '../server/routes';
import { MemStorage } from '../server/storage';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const storage = new MemStorage();
registerRoutes(app, storage);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return new Promise((resolve, reject) => {
    app(req as any, res as any, (err: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(undefined);
      }
    });
  });
}
