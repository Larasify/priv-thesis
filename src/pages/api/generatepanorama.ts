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
  console.log(id);
  const cater_install_path =
    "~/code/CATER/build/external/Build/cater/ui/cli/cater-cli";
  var shell = require("shelljs");

  var output4 = shell.exec(
    `${cater_install_path} pano --rows 4000 --cols 4000 /home/larasify/code/frames/${id}_output/now/results.yml`
    , { async: true }
  );

  res.status(200).json({ message: "success" });
}
