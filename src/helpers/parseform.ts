import formidable from "formidable";
import type { NextApiRequest } from "next";

export const parseForm = async (
  req: NextApiRequest,
  id: string
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  return new Promise(async (resolve, reject) => {
    const form = formidable({
      maxFiles: 1,
      maxFileSize: 1000 * 1024 * 1024,
      uploadDir: "./public/files/",
      filename: (name, file) => {
        return id + ".mp4";
      },
      keepExtensions: true,
    });
    form.parse(req, (err, fields, files) => {
      console.log(fields);

      //change file name to fields.id

      if (err) {
        reject(err);
        return;
      }
      resolve({ fields, files });
    });
  });
};
