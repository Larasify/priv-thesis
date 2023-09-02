import type { NextApiRequest, NextApiResponse } from "next";

export default async function generatepanorama(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string }>
) {
  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }
  const id = req.body.id;
  var shell = require("shelljs");

  var output4 = shell.exec(
    `${process.env.CATER_PATH} pano --rows 4000 --cols 4000 ${process.env.FRAMES_PATH}/${id}_output/now/results.yml`,
    { async: true }, { silent: true}
  );
  output4.stdout.on("data", function (data: any) { 
    console.log("hi: "+data);
  });
  
  res.status(200).json({ message: "success" });
}
