import React, { FormEvent, useRef, useState } from "react";

import dynamic from "next/dynamic";

import { FaArrowRight, FaCode, FaExpand, FaInfo } from "react-icons/fa";
import toast from "react-hot-toast";
import { z } from "zod";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Home() {
  const router = useRouter();

  const [isJoiningRoom, setIsJoiningRoom] = useState(false);
  const codeRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (codeRef && codeRef.current) {
      const roomCode = codeRef.current.value;
      //console.log(roomCode);
      codeRef.current.value = "";

      /*const result = z.string().min(6).max(6).safeParse(roomCode);
      if (!result.success) {
        toast.error("Invalid room code", {
          style: { borderRadius: "10px", background: "#333", color: "#fff" },
        });
        return;
      }*/

      setIsJoiningRoom(true);
      void router.push(`/video/${roomCode}`);
    }
  };
  const [file, setFile] = useState<File>();
  const uploadFile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;
    if (file.type !== "video/mp4") {
      toast.error("Invalid file type", {
        style: { borderRadius: "10px", background: "#333", color: "#fff" },
      });
      return;
    }

    //upload file to /api/upload
    const formData = new FormData();
    formData.append("media", file);
    let id = "";

    fetch("/api/upload", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((res) => {
        id = res.id;
        void router.push(`/processing/${id}`);
      })
      .catch((err) => {
        console.log(err);
      });

    //void router.push(`/processing/${id}`);
  };
  return (
    <>
      <div className="flex flex-col justify-between h-screen">
        <div className="flex flex-row align-middle items-center font-mono mx-auto gap-4 text-3xl text-neutral-200 font-bold pt-4">
            <FaExpand className=" text-primary" /> CATER WEB INTERFACE
        </div>
        <div className="flex flex-col align-middle items-center gap-14 pt-48 font-mono h-full">
          <form onSubmit={handleSubmit}>
            <div className="mx-auto flex max-w-[330px] justify-center gap-2">
              <input
                name="code"
                id="code"
                autoComplete="off"
                placeholder="enter video code"
                type="text"
                className="input-bordered rounded-r-sm input w-full max-w-xs"
                ref={codeRef}
              />
              <button
                type="submit"
                disabled={isJoiningRoom}
                className={`h-10 w-12 place-items-center rounded-l-none`}
              >
                <div className="p-4 rounded-2xl rounded-l-sm btn btn-primary">
                  <FaArrowRight className="text-neutral-200" />
                </div>
              </button>
            </div>
          </form>

          <div className="font-bold text-neutral-200 text-xl">or</div>

          <form
            onSubmit={uploadFile}
            className="flex flex-col align-middle items-center gap-2"
          >
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Pick a file</span>
                <span className="label-text-alt">MP4 Format</span>
              </label>
              <input
                type="file"
                className="file-input file-input-bordered w-full max-w-xs"
                onChange={(e) => {
                  if (e.target.files) {
                    setFile(e.target.files[0]);
                  }
                }}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Submit File
            </button>
          </form>
        </div>
        <div className="flex items-end justify-around bg-transparent pb-8 font-mono">
          <Link
            href="https://github.com/larasify"
            className="flex cursor-pointer items-center space-x-1.5 text-sm transition-colors duration-200 hover:text-primary"
          >
            <FaCode />
            <div>github</div>
          </Link>
          <Link
            href="/about"
            className="flex cursor-pointer items-center space-x-1.5 text-sm transition-colors duration-200 hover:text-primary"
          >
            <FaInfo /> <div>about</div>
          </Link>
        </div>
      </div>
    </>
  );
}
