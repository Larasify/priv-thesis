import type { NextApiRequest, NextApiResponse } from 'next'
import {parseForm} from '../../helpers/parseform'
import { v4 } from 'uuid';

type Data = {
    message: string
    id?:string
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
      const id = v4().slice(0, 6);

        const { fields, files } = await parseForm(req, id);
        //console.log(fields);
        //console.log(files);
        //console.log(files.media[0].filepath);
        const filepath = files.media[0].filepath;
        var shell = require('shelljs');
        shell.mkdir(`/home/larasify/code/frames/${id}`)
        var output = shell.exec('ffmpeg -r 1 -i ' + filepath + ` -r 1 "/home/larasify/code/frames/${id}/img%03d.png"`);
        var output2 = shell.exec(`~/code/CATER/build/external/Build/cater/ui/cli/cater-cli init /home/larasify/code/frames/${id}`);
        var output3 = shell.exec(`~/code/CATER/build/external/Build/cater/ui/cli/cater-cli track /home/larasify/code/frames/${id}_output/now/results.yml`);




        res.status(200).json({ message: "success", id: id });

    }catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal Server Error" });
    }
  }