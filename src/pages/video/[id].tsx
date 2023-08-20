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
import { set } from "zod";
import PanoramaButton from "../Components/PanoramaButton";
import PopoutFrame from "../Components/PopoutFrame";

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

          {id && (
            <PopoutFrame
              playerRef={playerRef}
              isPlaying={isPlaying}
              state={{
                playedSeconds: 0,
              }}
              id={id}
            />
          )}

          {id && <PanoramaButton id={id} />}
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
      </div>
    </>
  );
}
