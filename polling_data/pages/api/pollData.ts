import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';
import axios from 'axios';

const POLL_INTERVAL = 60000; // 60 seconds

class HttpException extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function fetchStockData(stockSymbol: string) {
  try {
    const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price`, {
      params: {
        ids: stockSymbol,
        vs_currencies: 'inr',
        include_last_updated_at: true,
        precision: 'full'
      },
    });

    if (!response.data || !response.data[stockSymbol]) {
      console.log({statusCode:400,message:'something went rwrong'});  
    }

    return {
      symbol: stockSymbol,
      timestamp: new Date(),
      price: response.data[stockSymbol].inr,
    };
  } catch (error) {
    if (error instanceof HttpException) {
      throw error;
    }
    console.log({statusCode:400,message:'something went wrong'});
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise;
    const db = client.db('fomodb');
    const collection = db.collection('fomostockdata');

    const pollStockData = async () => {
      try {
        const stockSymbols = ['bitcoin', 'ethereum', 'ripple', 'litecoin', 'cardano'];
        const dataPromises = stockSymbols.map((symbol) => fetchStockData(symbol));

        const stockData = (await Promise.all(dataPromises)).filter(data => data !== null);
        console.log(stockData);
        if (stockData.length > 0) {
          const insertResult = await collection.insertMany(stockData.map((data) => ({ ...data })));
          console.log("Inserted count:", insertResult.insertedCount);
        }

      } catch (error) {
        console.log({statusCode:400,message:'something went rwrong'});
      }
    };

    pollStockData();
    setInterval(pollStockData, POLL_INTERVAL);

    res.status(200).json({ message: 'Polling started' });
  } catch (error) {
    if (error instanceof HttpException) {
      res.status(error.status).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
