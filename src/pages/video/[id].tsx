import { useRouter } from "next/router";
import React, { useEffect, useMemo, useRef, useState } from "react";

import dynamic from "next/dynamic";

import captureVideoFrame from "../../helpers/capturevideoframe";

import { ReactPlayerProps } from "react-player";

import Draggable from "react-draggable";
import clsx from "clsx";
import toast from "react-hot-toast";

const ReactPlayer = dynamic(() => import("../../helpers/ReactPlayerWrapper"), {
  ssr: false,
});

export default function VideoPage() {
  const [overlay, setOverlay] = React.useState([
    { time: 0, coordinates: { x: 0, y: 0 } },
    { time: 1, coordinates: { x: 0, y: 0 } },
  ]);
  useEffect(() => {
    fetch(`/api/getoverlay/12345`)
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setOverlay(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const router = useRouter();
  const { id } = router.query;

  const [playing, isPlaying] = useState(false);
  const playerRef = useRef(null);
  const [image, setImage] = useState(null);
  const nodeRef = React.useRef(null);

  const [position, setPosition] = useState({ x: 0, y: 0 });

  const [state, setState] = useState({
    playedSeconds: 0,
    played: 0,
    loaded: 0,
    loadedSeconds: 0,
  });

  const currentPos = useMemo(() => {
    if (!overlay) return { x: 0, y: 0 };
    //get the xy for current time
    const { playedSeconds } = state;
    const {
      coordinates: { x, y },
    } =
      overlay.find(({ time }) => time > playedSeconds) ||
      overlay[overlay.length - 1];
    return { x, y };
  }, [overlay, state.playedSeconds]);
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
  const left = currentPos.x;
  const top = currentPos.y;

  const modalRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <div className="flex flex-col align-middle items-center pt-4 font-mono">
        <div className="relative w-max h-max">
          <ReactPlayer
            playerRef={playerRef}
            playing={playing}
            url={`/files/${id}.mp4`}
            controls={true}
            onPlay={() => isPlaying(true)}
            onPause={() => isPlaying(false)}
            progressInterval={125}
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
              "w-12 h-12 text-teal-300 border-teal-300 border-4 p-4 absolute transition-all duration-150"
            )}
            style={{ left, top }}
          ></div>
        </div>
        <div className="gap-2 px-4 py-4 flex flex-row">
          <button className="btn btn-neutral" onClick={() => isPlaying(true)}>
            Play
          </button>
          <button className="btn btn-neutral" onClick={() => isPlaying(false)}>
            Pause
          </button>
          <button
            className="btn btn-neutral"
            onClick={() => {
              isPlaying(false);
              const frame = captureVideoFrame(
                (playerRef as ReactPlayerProps).current?.getInternalPlayer()
              );
              console.log(frame);
              if (frame) {
                setImage(frame.dataUri);

                modalRef.current?.showModal();
              }
            }}
          >
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
        <div>
          x: {currentPos.x} y: {currentPos.y}
        </div>
        <div>Confidence: 22.5%</div>

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
                    className=" w-12 h-12 text-teal-300 border-teal-300 border-4 p-4"
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
