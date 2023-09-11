import type { NextApiRequest, NextApiResponse } from "next";

export default async function panoramaexists(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string }>
) {
  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }
  const id = req.body.id;

  var shell = require("shelljs");
  shell.mkdir("-p",`./public/files/panorama/`);

  var output = shell.cp(
    `-u`,
    `${process.env.FRAMES_PATH}/${id}_output/now/panorama/pano2_opt_dense.png`,
    `${process.env.BUILD_PATH}/public/files/panorama/${id}.png`
  );
  //check if file exists
  if (output.code !== 0) {
    res.status(500).json({ message: "Panorama Doesn't Exist" });
    return;
  }

  res.status(200).json({ message: `/files/panorama/${id}.png` });
}
