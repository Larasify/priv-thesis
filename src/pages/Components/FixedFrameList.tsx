import { useRouter } from "next/router";
import React, { Dispatch, useEffect, useMemo, useRef, useState } from "react";

import dynamic from "next/dynamic";

import captureVideoFrame from "../../helpers/capturevideoframe";

import { ReactPlayerProps } from "react-player";

import Draggable from "react-draggable";
import clsx from "clsx";
import toast from "react-hot-toast";
import { FaHome, FaPause, FaPlay } from "react-icons/fa";
import { FaUpRightFromSquare } from "react-icons/fa6";
import { frame } from "../api/getoverlay/[videoid]";
import { set } from "zod";
import PanoramaButton from "../Components/PanoramaButton";

export default function FixedFrameList(props: {
  playerRef: ReactPlayerProps;
  isPlaying: Dispatch<React.SetStateAction<boolean>>;
  state: {
    playedSeconds: number;
  };
  id: string | string[];
}) {
  const [image, setImage] = useState(null);
  const nodeRef = React.useRef(null);

  const modalRef = useRef<HTMLDialogElement>(null);

  const playerRef = props.playerRef;
  const isPlaying = props.isPlaying;
  const state = props.state;
  const id = props.id;

  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleDrag = (e: any, ui: { deltaX: number; deltaY: number }) => {
    const { x, y } = position;
    setPosition({
      x: x + ui.deltaX,
      y: y + ui.deltaY,
    });
  };

  const [FrameList, setFrameList] = useState([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
  ]);

  return (
    <>
      <button
        className="btn btn-neutral"
        onClick={() => {
          isPlaying(false);
          const frame = captureVideoFrame(
            (playerRef as ReactPlayerProps).current?.getInternalPlayer()
          );
          if (frame) {
            setImage(frame.dataUri);

            modalRef.current?.showModal();
          }
        }}
      >
        <FaUpRightFromSquare />
        Pop Frame
      </button>

      <dialog id="leaderboard_modal" className="modal" ref={modalRef}>
        <form method="dialog" className="modal-box max-w-full h-full">
          <div className="flex flex-col align-middle items-center">
            <div className="flex flex-row jusify gap-8">
              <div className="border-neutral-500 border-2 p-4 rounded-2xl items-center overflow-y-scroll h-[720px] overflow-x-hidden">
                {FrameList.map((object, i) => {
                  return (
                    <div
                      key={i}
                      className="collapse collapse-arrow border-2 border-neutral-500 w-36 my-2"
                    >
                      <input
                        type="radio"
                        name="my-accordion-2"
                      />
                      <div className="collapse-title text-xl font-medium">
                        {object}
                      </div>
                      <div className="collapse-content">
                        <p>hello</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="h-[720px] w-[1280px] relative overflow-hidden">
                {image && (
                  <img src={image} className="w-[1280px] h-[720px]" alt="hey" />
                )}
                <Draggable
                  defaultPosition={{ x: -24, y: -744 }}
                  bounds="parent"
                  nodeRef={nodeRef}
                  onDrag={handleDrag}
                >
                  <div
                    ref={nodeRef}
                    className=" w-12 h-12 border-red-500 border-4 p-4"
                  ></div>
                </Draggable>
              </div>
            </div>
            <span className="bold">
              {" "}
              {position.x} {position.y}
            </span>

            <button
              className="btn btn-primary"
              onClick={() => {
                fetch(`/api/postfixedframe`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    id: id,
                    time: state.playedSeconds,
                    coordinates: position,
                  }),
                })
                  .then((res) => res.json())
                  .then((res) => {
                    console.log(res);
                    toast.success("Successfully Fixed Frame", {
                      style: {
                        borderRadius: "10px",
                        background: "#333",
                        color: "#fff",
                      },
                    });
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }}
            >
              Send Fixed Frame
            </button>
          </div>
        </form>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
