import type { NextApiRequest, NextApiResponse } from "next";
import { parseForm } from "../../helpers/parseform";
import { v4 } from "uuid";

type Data = {
  message: string;
  id?: string;
};

export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }

  try {
    const id = v4().slice(0, 6);

    const { fields, files } = await parseForm(req, id);
    //console.log(fields);
    //console.log(files);
    //console.log(files.media[0].filepath);
    const filepath = files.media[0].filepath;

    run_processing(id, filepath).then(() => {
      console.log("done");
    });

    res.status(200).json({ message: "success", id: id });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function run_processing(id: string, filepath: string) {
  var shell = require("shelljs");
  
  shell.mkdir(`${process.env.FRAMES_PATH}/${id}`);
  await new Promise((resolve) => setTimeout(resolve, 500));

  var output = shell.exec(
    "ffmpeg -r 1 -i " +
      filepath +
      ` -r 1 "${process.env.FRAMES_PATH}/${id}/img%05d.png"`
  );
  await new Promise((resolve) => setTimeout(resolve, 500));

  var output2 = shell.exec(
    `${process.env.CATER_PATH} init ${process.env.FRAMES_PATH}/${id}`
  );
  await new Promise((resolve) => setTimeout(resolve, 500));
  var output3 = shell.exec(
    `${process.env.CATER_PATH} track ${process.env.FRAMES_PATH}/${id}_output/now/results.yml`
  );
}
