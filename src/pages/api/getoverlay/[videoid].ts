// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { useRouter } from "next/router";



type Data = {
  time : number
  coordinates : {
    x : number
    y : number
  }
};
//create a sample dataset of Data type with 10 elements
const data: Data[] = [];
for (let i = 0; i < 10; i++) {
  data.push({
    time: i,
    coordinates: {
      x: i,
      y: i,
    },
  });
}


export default function getoverlay(
  req: NextApiRequest,
  res: NextApiResponse<Data[]>
) {
  const { videoid } = req.query;
  console.log(videoid);
  //return files array as json
  res.status(200).json(data);

  //res.status(200).json({ name: 'John Doe' })
}
