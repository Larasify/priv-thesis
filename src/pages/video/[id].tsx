import { useRouter } from "next/router";
import React, { useEffect, useMemo, useRef, useState } from "react";

import dynamic from "next/dynamic";

import captureVideoFrame from "../../helpers/capturevideoframe";

import { ReactPlayerProps } from "react-player";

import Draggable from "react-draggable";
import clsx from "clsx";
import toast from "react-hot-toast";
import { FaHome, FaPause, FaPlay } from "react-icons/fa";
import { FaUpRightFromSquare } from "react-icons/fa6";
import { frame } from "../api/getoverlay/[videoid]";

const ReactPlayer = dynamic(() => import("../../helpers/ReactPlayerWrapper"), {
  ssr: false,
});

export default function VideoPage() {
  const [overlay, setOverlay] = React.useState(new Array<frame>());

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) return;
    fetch(`/api/getoverlay/${id}`)
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setOverlay(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  const [playing, isPlaying] = useState(false);
  const playerRef = useRef(null);
  const [image, setImage] = useState(null);
  const nodeRef = React.useRef(null);

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [duration, setDuration] = useState(0);

  const [state, setState] = useState({
    playedSeconds: 0,
    played: 0,
    loaded: 0,
    loadedSeconds: 0,
  });

  const currentFrame = useMemo(() => {
    if (overlay.length == 0) return 0;
    //get the xy for current time
    const currentFrame = Math.floor(
      (state.playedSeconds / duration) * overlay.length /*frame count*/
    );
    return currentFrame;
  }, [overlay, state.playedSeconds, duration]);

  const currentPos = useMemo(() => {
    if (overlay.length == 0 || overlay.length <= currentFrame)
      return { x: 0, y: 0 };
    const videoWidth = (
      playerRef as ReactPlayerProps
    ).current?.getInternalPlayer().videoWidth;
    const videoHeight = (
      playerRef as ReactPlayerProps
    ).current?.getInternalPlayer().videoHeight;
    //get the xy for current time
    const x = (overlay[currentFrame].position[0] * 1280) / videoWidth;
    const y = (overlay[currentFrame].position[1] * 720) / videoHeight;

    return { x, y };
  }, [overlay, currentFrame]);

  console.log(currentPos);

  const handleDrag = (e: any, ui: { deltaX: number; deltaY: number }) => {
    const { x, y } = position;
    setPosition({
      x: x + ui.deltaX,
      y: y + ui.deltaY,
    });
  };

  if (
    playerRef &&
    playerRef.current &&
    (playerRef as ReactPlayerProps).current?.getInternalPlayer()
  ) {
    console.log(
      (playerRef as ReactPlayerProps).current?.getInternalPlayer().currentTime
    );
  }
  const left = currentPos.x - 24;
  const top = currentPos.y - 24;

  const modalRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <div
        className="btn btn-neutral absolute bottom-4 right-4"
        onClick={() => {
          void router.push(`/`);
        }}
      >
        <FaHome />
        Home
      </div>
      <div className="flex flex-col align-middle items-center pt-4 font-mono">
        <div className="relative w-max h-max">
          <ReactPlayer
            playerRef={playerRef}
            playing={playing}
            url={`/files/${id}.mp4`}
            controls={true}
            width={1280}
            height={720}
            onPlay={() => isPlaying(true)}
            onPause={() => isPlaying(false)}
            progressInterval={41}
            onDuration={(e) => {
              setDuration(e);
            }}
            onProgress={(e) => {
              console.log(e);
              setState({
                playedSeconds: e.playedSeconds,
                played: e.played,
                loaded: e.loaded,
                loadedSeconds: e.loadedSeconds,
              });
            }}
          />
          <div
            className={clsx(
              "w-12 h-12 border-red-500 border-4 p-4 absolute transition-all"
            )}
            style={{ left, top }}
          ></div>
        </div>
        <div className="gap-2 px-4 py-4 flex flex-row">
          <button className="btn btn-neutral" onClick={() => isPlaying(true)}>
            <FaPlay />
            Play
          </button>
          <button className="btn btn-neutral" onClick={() => isPlaying(false)}>
            <FaPause />
            Pause
          </button>
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
        </div>
        {(playerRef as ReactPlayerProps).current?.getInternalPlayer() && (
          <div>
            {
              (playerRef as ReactPlayerProps).current?.getInternalPlayer()
                .currentTime
            }
          </div>
        )}
        <div>{state.playedSeconds}</div>
        <div>{duration}</div>
        <progress
          className="progress w-56"
          value={state.playedSeconds}
          max={duration}
        ></progress>
        <div>
          x: {currentPos.x} y: {currentPos.y}
        </div>
        <div>
          Theta Quality:{" "}
          {overlay.length != 0 && currentFrame < overlay.length
            ? overlay[currentFrame].theta_quality
            : 0}
        </div>
        <div>Frame:{currentFrame}</div>

        {/*POPOUT MODAL FRAME*/}
        <dialog id="leaderboard_modal" className="modal" ref={modalRef}>
          <form method="dialog" className="modal-box max-w-4xl h-2/3">
            <div className="flex flex-col align-middle items-center">
              <div className="h-[360px] w-[640px] relative overflow-hidden">
                {image && (
                  <img src={image} className="w-[640px] h-[360px]" alt="hey" />
                )}
                <Draggable
                  defaultPosition={{ x: 0, y: -360 }}
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
      </div>
    </>
  );
}
