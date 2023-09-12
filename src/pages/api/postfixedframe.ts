// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { parse,stringify } from "yaml";
import { string } from "zod";

const readYaml = async (id: string) => {
  const fs = require("fs");
  const file = fs.readFileSync(
    `${process.env.FRAMES_PATH}/${id}_output/now/detections.yml`,
    "utf8"
  );
  const data = parse(file);
  return data;
};

const writeYaml = async (id: string, data: any) => {
  const fs = require("fs");
  const file = fs.writeFileSync(
    `${process.env.FRAMES_PATH}/${id}_output/now/_detections.yml`,
    stringify(data),
  );
  return;
};

type Data = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }

  // Process a POST request
  const id = req.body.id;
  const frameList = req.body.frameList;
  const data = await readYaml(id as string);
  for (let i = 0; i < frameList.length; i++) {
    data.detections[frameList[i].frame].position = [
      frameList[i].x,
      frameList[i].y,
    ];
    data.detections[frameList[i].frame].manually_set = 1;
  }
  await writeYaml(id as string, data);

  var shell = require("shelljs");
  shell.exec(
    `${process.env.CATER_PATH} track ${process.env.FRAMES_PATH}/${id}_output/now/results.yml`,
    { async: true, silent: false },
    function (code: any, stdout: any, stderr: any) {
      console.log("Cater Success:", code);
    }
  );
  res.status(200).json({ message: "success" });
}
