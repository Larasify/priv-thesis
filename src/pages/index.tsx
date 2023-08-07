import React, { FormEvent, useRef, useState } from "react";

import dynamic from "next/dynamic";

import { FaArrowRight } from "react-icons/fa";
import toast from "react-hot-toast";
import { z } from "zod";
import { useRouter } from "next/router";
import { v4 } from 'uuid';

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
  return (
    <>
      <div className="text-center font-mono text-3xl text-neutral-500 font-bold">
        CATER INTERFACE
      </div>
      <div className="flex flex-col align-middle items-center gap-14 pt-48 font-mono">
        <form onSubmit={handleSubmit}>
          <div className="mx-auto flex max-w-[330px] justify-center gap-2">
            <input
              name="code"
              id="code"
              autoComplete="off"
              placeholder="enter video code"
              type="text"
              className="input-bordered input w-full max-w-xs"
              ref={codeRef}
            />
            <button
              type="submit"
              disabled={isJoiningRoom}
              className={`h-10 w-12 place-items-center rounded-l-none`}
            >
              <FaArrowRight className="text-bg text-primary" />
            </button>
          </div>
        </form>

        <div className="font-bold text-xl">or</div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const id = v4().slice(0, 6);
            void router.push(`/processing/${id}`);
          }}
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
            />
          </div>
          <button type="submit" className="btn btn-primary">Submit File</button>
        </form>
      </div>
    </>
  );
}
