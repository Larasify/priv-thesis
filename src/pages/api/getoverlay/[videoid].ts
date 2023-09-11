// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { useRouter } from "next/router";
import { parse, stringify } from "yaml";

const readYaml = async (id: string) => {
  const fs = require("fs");
  const file = fs.readFileSync(
    `${process.env.FRAMES_PATH}/${id}_output/now/detections.yml`,
    "utf8"
  );
  const data = parse(file);
  return data;
};

export type frame = {
  frame_no: number;
  position: number[];
  theta: number;
  theta_quality: number;
  manually_set: boolean;
};

export default async function getoverlay(
  req: NextApiRequest,
  res: NextApiResponse<frame[]>
) {
  const { videoid } = req.query;
  console.log(videoid);
  const data = await readYaml(videoid as string);
  const frames: frame[] = data.detections;
  //console.log(frames[0].position);

  //return files array as json
  res.status(200).json(frames);
  
}
