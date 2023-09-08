import type { NextApiRequest, NextApiResponse } from "next";

export default async function generatepanorama(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string }>
) {
  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }
  console.log(req.body);
  const id = req.body.id;
  console.log(id);
  var shell = require("shelljs");

  var output = shell.test('-f', `${process.env.BUILD_PATH}/public/files/${id}.mp4`)
  console.log(output);
  //check if file exists
  if (!output) {
    res.status(404).json({ message: "File Doesn't Exist" });
    return;
  }

  res.status(200).json({ message: `File Exists` });
}
