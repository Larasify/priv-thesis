import { useRouter } from "next/router";
import * as React from "react";
import { FaCopy } from "react-icons/fa";
import { toast } from "react-hot-toast";

export default function VideoCode() {
  const router = useRouter();

  return (
    <span
      onClick={() => {
        if (router.query?.processingid) {
          void navigator.clipboard
            .writeText(router?.query?.processingid as string)
            .then(() => {
              toast.success("Copied to clipboard", {
                style: {
                  borderRadius: "10px",
                  background: "#333",
                  color: "#fff",
                },
              });
            });
        }
      }}
      className="btn text-white relative flex cursor-pointer items-center bg-neutral px-4 pt-5 text-3xl font-bold w-max h-max"
    >
      <span className="absolute left-0 top-0 whitespace-nowrap px-4 pt-1 text-xs">
        copy video id
      </span>
      {router.query?.processingid}
      <FaCopy className="ml-2 text-2xl" />
    </span>
  );
}
