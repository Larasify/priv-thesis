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
let first_x = 320
let first_y = 180
const data: Data[] = [];
for (let i = 0; i < 3300; i++) {
  //randomly move the coordinates by 10 pixels dont go over 640x360

  first_x = first_x + Math.floor(Math.random() * 30) - 15
  first_y = first_y + Math.floor(Math.random() * 30) - 15
  if (first_x > 640) {
    first_x = 640
  }
  if (first_x < 0) {
    first_x = 0
  }
  if (first_y > 360) {
    first_y = 360
  }
  if (first_y < 0) {
    first_y = 0
  }

  data.push({
    time: i/8,
    coordinates: {
      x: first_x,
      y: first_y,
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
