import { useRouter } from "next/router";
import React, { Dispatch, useEffect, useMemo, useRef, useState } from "react";

import dynamic from "next/dynamic";

import captureVideoFrame from "../../helpers/capturevideoframe";

import { ReactPlayerProps } from "react-player";

import Draggable from "react-draggable";
import clsx from "clsx";
import toast from "react-hot-toast";
import { FaHome, FaPause, FaPlay, FaTrash } from "react-icons/fa";
import { FaUpRightFromSquare } from "react-icons/fa6";
import { set } from "zod";
import PanoramaButton from "../Components/PanoramaButton";

type fixedFrame = {
  frame: number;
  x: number;
  y: number;
};

export default function FixedFrameList(props: {
  playerRef: ReactPlayerProps;
  isPlaying: Dispatch<React.SetStateAction<boolean>>;
  id: string | string[];
  currentFrame: number;
}) {
  const [image, setImage] = useState(null);
  const nodeRef = React.useRef(null);

  const modalRef = useRef<HTMLDialogElement>(null);

  const playerRef = props.playerRef;
  const isPlaying = props.isPlaying;
  const id = props.id;

  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleDrag = (e: any, ui: { deltaX: number; deltaY: number }) => {
    const { x, y } = position;
    setPosition({
      x: x + ui.deltaX,
      y: y + ui.deltaY,
    });
  };

  const [FrameList, setFrameList] = useState(new Array<fixedFrame>());

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
          <div className="flex flex-col align-middle">
            <div className="flex gap-8">
              <div className="border-neutral-500 border-2 p-4 rounded-2xl items-center overflow-y-scroll h-[720px] w-1/6 overflow-x-hidden">
                {FrameList.map((object, i) => {
                  return (
                    <div
                      key={i}
                      className="collapse collapse-arrow border-2 border-neutral-500 w-full my-2"
                    >
                      <input type="radio" name="my-accordion-2" />
                      <div className="collapse-title text-xl font-medium">
                        {object.frame}
                      </div>
                      <div className="collapse-content text-sm">
                        <div className="flex flex-col justify-between">
                          <p>Previous Coord: 6 9</p>
                          <p>
                            Fixed Coord: {object.x} {object.y}
                          </p>
                          <div className="btn btn-primary btn-sm w-24">
                            Show Frame
                          </div>
                          <div className="flex justify-end">
                            <div onClick={() => {
                                const newFrameList = FrameList.filter((item) => item.frame != object.frame);
                                setFrameList(newFrameList);
                            }}>
                              <FaTrash className="text-red-700 hover:text-red-500" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={image}
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const naturalWidth = e.currentTarget.naturalWidth;
                    const naturalHeight = e.currentTarget.naturalHeight;
                    var xCoord = Math.round(
                      ((e.clientX - rect.left) / (rect.right - rect.left)) *
                        naturalWidth
                    );
                    var yCoord = Math.round(
                      ((e.clientY - rect.top) / (rect.bottom - rect.top)) *
                        naturalHeight
                    );
                    if (xCoord < 0) {
                      xCoord = 0;
                    }
                    if (yCoord < 0) {
                      yCoord = 0;
                    }
                    //if currentFrame in FrameList, toast error
                    for (let i = 0; i < FrameList.length; i++) {
                      if (FrameList[i].frame == props.currentFrame) {
                        toast.error("Frame already fixed", {
                          style: {
                            borderRadius: "10px",
                            background: "#333",
                            color: "#fff",
                          },
                        });
                        return;
                      }
                    }
                    FrameList.push({
                      frame: props.currentFrame,
                      x: xCoord,
                      y: yCoord,
                    });
                    setPosition({ x: xCoord, y: yCoord });
                  }}
                  className="w-[1280px] h-[720px]"
                  alt="hey"
                />
              )}
            </div>
            <span className="bold">
              {" "}
              {position.x} {position.y}
            </span>

            <button
              className="btn btn-primary"
              onClick={() => {
                /*
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
                  */
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
