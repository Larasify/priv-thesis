/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import React, { Dispatch, useEffect, useMemo, useRef, useState } from "react";

import captureVideoFrame from "../../helpers/capturevideoframe";

import { ReactPlayerProps } from "react-player";

import toast from "react-hot-toast";
import { FaHome, FaPause, FaPlay, FaTrash } from "react-icons/fa";
import { FaUpRightFromSquare } from "react-icons/fa6";
import { frame } from "../api/getoverlay/[videoid]";
import clsx from "clsx";

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
  overlay: Array<frame>;
}) {
  const nodeRef = React.useRef(null);

  const modalRef = useRef<HTMLDialogElement>(null);

  const playerRef = props.playerRef;
  const isPlaying = props.isPlaying;
  const id = props.id;

  const modalImgRef = useRef<HTMLImageElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [FrameList, setFrameList] = useState(new Array<fixedFrame>());

  const [image, setImage] = React.useState("");

  const [modalCurrentFrame, setModalCurrentFrame] = useState(0);

  const [nextFrameOnClick, setNextFrameOnClick] = useState(false);

  function getCurrentImage(id: string, frame: number) {
    if (!id) return;
    fetch("/api/getimage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        frame: frame,
      }),
    }).then(async (res) => {
      const img = await res.blob();
      setImage(URL.createObjectURL(img));
    });
  }

  useEffect(() => {
    getCurrentImage(id as string, modalCurrentFrame + 1);
    if (inputRef.current) inputRef.current.value = modalCurrentFrame.toString();
  }, [modalCurrentFrame]);

  const currentFixedFrameCoords = useMemo(() => {
    console.log("heycuties");
    if (FrameList.length == 0) return { x: 0, y: 0 };
    for (let i = 0; i < FrameList.length; i++) {
      if (FrameList[i].frame == modalCurrentFrame) {
        return { x: FrameList[i].x, y: FrameList[i].y };
      }
    }
    return { x: 0, y: 0 };
  }, [FrameList, FrameList.length, modalCurrentFrame]);

  return (
    <>
      <button
        className="btn btn-neutral"
        onClick={() => {
          isPlaying(false);
          setModalCurrentFrame(props.currentFrame);
          modalRef.current?.showModal();
          /*const frame = captureVideoFrame(
            (playerRef as ReactPlayerProps).current?.getInternalPlayer()
          );
          if (frame) {
            //setImage(frame.dataUri);
          }*/
        }}
      >
        <FaUpRightFromSquare />
        Pop Frame
      </button>

      <dialog id="leaderboard_modal" className="modal" ref={modalRef}>
        <form method="dialog" className="modal-box max-w-full h-full">
          <div className="flex flex-col align-middle">
            <div className="flex gap-8">
              <div className="flex flex-col w-1/6 gap-4 items-center">
                <div className="border-neutral-500 border-2 p-4 rounded-2xl items-center overflow-y-scroll h-[720px] overflow-x-hidden w-full">
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
                            <p>
                              Previous Coord:{" "}
                              {props.overlay[object.frame].position[0]}{" "}
                              {props.overlay[object.frame].position[1]}{" "}
                            </p>
                            <p>
                              Fixed Coord: {object.x} {object.y}
                            </p>
                            <div
                              className="btn btn-primary btn-sm w-24"
                              onClick={() => {
                                setModalCurrentFrame(object.frame);
                              }}
                            >
                              Show Frame
                            </div>
                            <div className="flex justify-end">
                              <div
                                onClick={() => {
                                  const newFrameList = FrameList.filter(
                                    (item) => item.frame != object.frame
                                  );
                                  setFrameList(newFrameList);
                                }}
                              >
                                <FaTrash className="text-red-700 hover:text-red-500" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <button
                  className="btn btn-primary w-48 h-20"
                  onClick={() => {
                    fetch(`/api/postfixedframe`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        id: id,
                        frameList: FrameList,
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
                  Optimise With Fixed Frames
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {image && (
                  <div className="relative w-max h-max">
                    <img
                      src={image}
                      ref={modalImgRef}
                      onClick={(e) => {
                        console.log("hey");
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

                        //check if modalCurrentFrame is in FrameList without for loops
                        if (
                          FrameList.some(
                            (item) => item.frame == modalCurrentFrame
                          )
                        ) {
                          setFrameList(
                            FrameList.map((item) => {
                              if (item.frame == modalCurrentFrame) {
                                return {
                                  frame: modalCurrentFrame,
                                  x: xCoord,
                                  y: yCoord,
                                };
                              }
                              return item;
                            })
                          );
                        } else {
                          const newFrame = {
                            frame: modalCurrentFrame,
                            x: xCoord,
                            y: yCoord,
                          };
                          setFrameList([...FrameList, newFrame]);
                        }
                        if (nextFrameOnClick) {
                          if (modalCurrentFrame + 1 < props.overlay.length)
                            setModalCurrentFrame(modalCurrentFrame + 1);
                        }
                        /*FrameList.push({
                          frame: modalCurrentFrame,
                          x: xCoord,
                          y: yCoord,
                        });*/
                      }}
                      className="w-[1280px] h-[720px]"
                      alt="hey"
                    />
                    {modalImgRef.current && (
                      <>
                        <div
                          className={clsx(
                            "w-12 h-12 border-red-500 border-4 p-4 absolute transition-all"
                          )}
                          style={{
                            left:
                              (props.overlay[modalCurrentFrame].position[0] *
                                1280) /
                                modalImgRef.current.naturalWidth -
                              24,
                            top:
                              (props.overlay[modalCurrentFrame].position[1] *
                                720) /
                                modalImgRef.current.naturalHeight -
                              24,
                          }}
                        ></div>
                        {currentFixedFrameCoords.x !== 0 &&
                          currentFixedFrameCoords.y !== 0 && (
                            <div
                              className={clsx(
                                "w-12 h-12 border-green-500 border-4 p-4 absolute transition-all"
                              )}
                              style={{
                                left:
                                  (currentFixedFrameCoords.x * 1280) /
                                    modalImgRef.current.naturalWidth -
                                  24,
                                top:
                                  (currentFixedFrameCoords.y * 720) /
                                    modalImgRef.current.naturalHeight -
                                  24,
                              }}
                            ></div>
                          )}
                      </>
                    )}
                  </div>
                )}
                <div className="flex justify-center font-mono">
                  <div className="relative w-max">
                    <input
                      type="number"
                      name="frameInput"
                      id="frameInput"
                      className="input w-48 pl-8 border-neutral-500 border-2"
                      max={props.overlay.length - 1}
                      ref={inputRef}
                      placeholder={modalCurrentFrame.toString()}
                      onKeyDown={(e) => {
                        if (e.key == "Enter") {
                          e.preventDefault();
                          if (
                            (e.target as HTMLInputElement).value == "" ||
                            (e.target as HTMLInputElement).value == null
                          )
                            return;
                          if (
                            parseInt((e.target as HTMLInputElement).value) <
                              0 ||
                            parseInt((e.target as HTMLInputElement).value) >
                              props.overlay.length - 1
                          ) {
                            return;
                          }
                          setModalCurrentFrame(
                            parseInt((e.target as HTMLInputElement).value)
                          );
                        }
                      }}
                      onKeyUp={(e) => {
                        //if more than max set to max
                        if (
                          parseInt((e.target as HTMLInputElement).value) >
                          props.overlay.length - 1
                        ) {
                          (e.target as HTMLInputElement).value = (
                            props.overlay.length - 1
                          ).toString();
                        }
                        //if less than zero set to zero
                        if (
                          parseInt((e.target as HTMLInputElement).value) < 0 ||
                          (e.target as HTMLInputElement).value == "" ||
                          (e.target as HTMLInputElement).value == null
                        ) {
                          (e.target as HTMLInputElement).value = "0";
                        }
                      }}
                    />
                    <span className="absolute right-12 top-3">
                      / {props.overlay.length - 1}
                    </span>
                  </div>
                </div>
                <div className="flex flex-row items-center gap-4 justify-center">
                  <span className="font-mono font-bold text-neutral-500">
                    Next frame on click:
                  </span>
                  <input
                    type="checkbox"
                    checked={nextFrameOnClick}
                    className="checkbox"
                    onClick={(e) => {
                      setNextFrameOnClick(!nextFrameOnClick);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
