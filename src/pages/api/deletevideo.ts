import type { NextApiRequest, NextApiResponse } from "next";

export default async function deletevideo(
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

  var output = shell.rm("-rf", `${process.env.BUILD_PATH}/public/files/${id}.mp4`);
  var output2 = shell.rm("-rf", `${process.env.BUILD_PATH}/public/files/panorama/${id}.png`);
  var output3 = shell.rm("-rf", `${process.env.FRAMES_PATH}/${id}/`);
  var output4 = shell.rm("-rf", `${process.env.FRAMES_PATH}/${id}_output/`);

  //check if file exists
  if (!output) {
    res.status(404).json({ message: "File Doesn't Exist" });
    return;
  }

  res.status(200).json({ message: `File Deleted` });
}
