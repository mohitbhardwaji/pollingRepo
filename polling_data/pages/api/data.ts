import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { stock } = req.query;
  const client = await clientPromise;
  const db = client.db('fomodb');
  const collection = db.collection('fomostockdata');

  const data = await collection.find({ 'symbol': stock }).sort({ timestamp: -1 }).limit(20).toArray();
  res.status(200).json(data);
}
