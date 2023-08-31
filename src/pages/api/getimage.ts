import fs from "fs";
import path from "path";
import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
    api: {
      responseLimit: `20mb`,
    },
  }

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }
  console.log(req.body);
  const { id, frame } = req.body;
  //make frame number 5 digit with leading zeros
  if (!frame) {
    return res.status(404).end();
  }

  const imgName = "img" + frame.toString().padStart(5, "0") + ".png";

  const imagePath = path.join(
    `/home/larasify/code/frames/${id}/`,
    imgName
  );
  console.log(imagePath);

  fs.readFile(imagePath, (err, data) => {
    if (err) {
      res.status(500).end();
      return;
    }

    res.writeHead(200, {
      "Content-Type": "image/png",
      "Content-Length": data.length,
    });
    res.end(data);
  });
}
