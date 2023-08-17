import type { NextApiRequest, NextApiResponse } from 'next'
import {parseForm} from '../../helpers/parseform'

type Data = {
    message: string
    };

export const config = {
    api: {
        bodyParser: false,
        responseLimit: false,
    },
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
  ) {
    console.log("hey");
    if (req.method !== "POST") {
        res.status(405).send({ message: "Only POST requests allowed" });
        return;
      }
    try{
        const { fields, files } = await parseForm(req);
        console.log(fields);
        console.log(files);
        res.status(200).json({ message: "success" });

    }catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal Server Error" });
    }
  }