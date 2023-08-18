// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  files: string[];
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.log("hey");

  var shell = require("shelljs");
  shell.cd("src");
  shell.cd("pages");

  shell.echo("hello world");
  shell.exec("echo waitlol");
  //console.log(shell.ls()[0]);
  const files: string[] = [];
  shell.ls().forEach(function (file: string) {
    console.log(file);
    files.push(file);
  });

  var output = shell.exec(
    "~/code/CATER/build/external/Build/cater/ui/cli/cater-cli track /home/larasify/Desktop/videocli/destination_output/now/results.yml"
  );

  //return files array as json
  res.status(200).json({ files: output });

  //res.status(200).json({ name: 'John Doe' })
}
