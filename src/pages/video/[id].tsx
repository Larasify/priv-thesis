import { useRouter } from "next/router";
import React, { useEffect, useMemo, useRef, useState } from "react";

import dynamic from "next/dynamic";

import { ReactPlayerProps } from "react-player";

import clsx from "clsx";
import { FaHome, FaPause, FaPlay, FaTrash } from "react-icons/fa";
import { FaUpRightFromSquare } from "react-icons/fa6";
import { frame } from "../api/getoverlay/[videoid]";
import PanoramaButton from "../Components/PanoramaButton";
import FixedFrameList from "../Components/FixedFrameList";

const ReactPlayer = dynamic(() => import("../../helpers/ReactPlayerWrapper"), {
  ssr: false,
});

export default function VideoPage() {
  const [overlay, setOverlay] = React.useState(new Array<frame>());
  const [loadingOverlay, setLoadingOverlay] = React.useState(true);
  const [panoramaExists, setPanoramaExists] = React.useState(false);
  const [videoExists, setVideoExists] = React.useState(false);

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) return;
    fetch("/api/videoexists", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
      }),
    }).then(async (res) => {
      console.log(res);
      if (res.status == 200) {
        console.log("video exists");
        setVideoExists(true);
      } else {
        await router.push(`/404`);
      }
    });
  }, [id]);

  useEffect(() => {
    fetch(`/api/panoramaexists`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        //check if res code 200
        if (res.message.includes("png")) {
          setPanoramaExists(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  useEffect(() => {
    if (!id || !videoExists) return;
    fetch(`/api/getoverlay/${id}`)
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setOverlay(res);
        setLoadingOverlay(false);
      })
      .catch((err) => {
        console.log(err);
        router.push(`/processing/${id}`);
      });
  }, [id, videoExists]);

  const [playing, isPlaying] = useState(false);
  const playerRef = useRef(null);

  const [duration, setDuration] = useState(1);

  const [state, setState] = useState({
    playedSeconds: 0,
    played: 0,
    loaded: 0,
    loadedSeconds: 0,
  });

  const currentFrame = useMemo(() => {
    if (loadingOverlay) return 0;
    //get the xy for current time
    const currentFrame = Math.floor(
      (state.playedSeconds / duration) * overlay.length /*frame count*/
    );
    if (currentFrame >= overlay.length) return overlay.length - 1;
    return currentFrame;
  }, [overlay, state.playedSeconds, duration, loadingOverlay]);

  const currentPos = useMemo(() => {
    if (loadingOverlay || overlay.length <= currentFrame || !playerRef.current)
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
  }, [overlay, currentFrame, loadingOverlay]);

  if (loadingOverlay) {
    return (
      <div className="flex flex-col align-middle items-center pt-4 font-mono">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

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
        <div className="flex flex-row gap-2 ">
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
            {(currentPos.x != 0 || currentPos.y != 0) && (
              <div
                className={clsx(
                  "w-12 h-12 border-red-500 border-4 p-4 absolute transition-all"
                )}
                style={{ left, top }}
              ></div>
            )}
          </div>
          <div className="border-neutral-500 border-2 p-4 rounded-2xl h-[720px] font-semibold text-neutral-400 flex flex-col gap-4 tracking-wide">
            <div className="border-neutral-500 border-b-2">Information</div>
            <div className="flex flex-col">
              Frame Count:{" "}
              <span>
                {currentFrame}/{overlay.length - 1}
              </span>
            </div>

            <div className="flex flex-col">
              Theta Quality:
              <span>
                {overlay.length != 0 && currentFrame < overlay.length
                  ? overlay[currentFrame].theta_quality.toFixed(2)
                  : 0}
              </span>
            </div>

            <div className="flex flex-col">
              Video Duration:{" "}
              <span>
                {state.playedSeconds.toFixed(2)}/{duration}s{" "}
              </span>
            </div>

            <progress
              className="progress w-56 progress-success"
              value={state.playedSeconds}
              max={duration}
            ></progress>
            <div className="flex flex-col">
              Video coordinates:{" "}
              <span>
                x:{currentPos.x.toFixed(0)} y:{currentPos.y.toFixed(0)}
              </span>
            </div>
            <div className="flex flex-col">
              Overlay coordinates:{" "}
              <span>
                x:{overlay[currentFrame].position[0]} y:
                {overlay[currentFrame].position[1]}
              </span>
            </div>
            <div>
              Panorama:{" "}
              {panoramaExists ? (
                <span className=" text-green-500">Ready</span>
              ) : (
                <span className=" text-red-500">Not Ready</span>
              )}
            </div>
            <div>
              Overlay:{" "}
              {overlay.length !== 0 ? (
                <span className=" text-green-500">Ready</span>
              ) : (
                <span className=" text-red-500">Not Ready</span>
              )}
            </div>
          </div>
        </div>
        <div className="gap-4 px-4 py-4 flex flex-row w-max">
          <button className="btn btn-neutral" onClick={() => isPlaying(true)}>
            <FaPlay />
            Play
          </button>
          <button className="btn btn-neutral" onClick={() => isPlaying(false)}>
            <FaPause />
            Pause
          </button>

          {id && (
            <FixedFrameList
              playerRef={playerRef}
              isPlaying={isPlaying}
              id={id}
              currentFrame={currentFrame}
              overlay={overlay}
            />
          )}

          {id && <PanoramaButton id={id} />}

          <button
            onClick={() => {
              function Confirm() {
                var x;
                if (
                  confirm(
                    "Are you sure you wish to delete this video and all the proccessing data generated?"
                  ) == true
                ) {
                  fetch(`/api/deletevideo/${id}`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      id: id,
                    }),
                  }).then(async (res) => {
                    console.log(res);
                    if (res.status == 200) {
                      console.log("video deleted");

                      await router.push(`/`);
                    } else {
                      await router.push(`/404`);
                    }
                  });
                } else {
                }
              }
              return Confirm();
            }}
            className="group btn hover:bg-red-700 btn-neutral "
          >
            <span className="text-red-700 group-hover:text-neutral-400">
              <FaTrash />
            </span>
            Delete Video
          </button>
        </div>

        {/*POPOUT MODAL FRAME*/}
      </div>
    </>
  );
}
