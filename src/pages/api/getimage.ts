import fs from "fs";
import path from "path";
import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
    api: {
      responseLimit: `20mb`,
    },
  }

export default function getimage(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }
  const { id, frame } = req.body;
  //make frame number 5 digit with leading zeros
  if (!frame) {
    return res.status(404).end();
  }

  const imgName = "img" + frame.toString().padStart(5, "0") + ".png";

  const imagePath = path.join(
    `${process.env.FRAMES_PATH}/${id}/`,
    imgName
  );

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
