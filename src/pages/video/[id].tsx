import { useRouter } from "next/router";
import React, { useEffect, useRef } from "react";

import dynamic from "next/dynamic";

import captureVideoFrame from "../../helpers/capturevideoframe";

import { ReactPlayerProps } from "react-player";

import Draggable from "react-draggable";

const ReactPlayer = dynamic(() => import("../../helpers/ReactPlayerWrapper"), {
  ssr: false,
});

export default function VideoPage() {
  const [overlay, setOverlay] = React.useState(null);
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

  const [playing, isPlaying] = React.useState(false);
  const playerRef = useRef(null);
  const [image, setImage] = React.useState(null);
  const nodeRef = React.useRef(null);

  const [position, setPosition] = React.useState({ x: 0, y: 0 });

  const [state, setState] = React.useState({
    playedSeconds: 0,
    played: 0,
    loaded: 0,
    loadedSeconds: 0,
  });

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
  return (
    <>
      <ReactPlayer
        playerRef={playerRef}
        playing={playing}
        url={`/files/${id}.mp4`}
        controls={true}
        onPlay={() => isPlaying(true)}
        onPause={() => isPlaying(false)}
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
      <div>hi {playing}</div>
      <button onClick={() => isPlaying(true)}>Boop</button>
      <button onClick={() => isPlaying(false)}>Boop2</button>
      <button
        onClick={() => {
          const frame = captureVideoFrame(
            (playerRef as ReactPlayerProps).current?.getInternalPlayer()
          );
          console.log(frame);
          if (frame) setImage(frame.dataUri);
        }}
      >
        Boop3
      </button>
      {(playerRef as ReactPlayerProps).current?.getInternalPlayer() && (
        <div>
          {
            (playerRef as ReactPlayerProps).current?.getInternalPlayer()
              .currentTime
          }
        </div>
      )}
      <div>{state.playedSeconds}</div>
      {image && (
        <div className="h-[360px] w-[640px] relative overflow-hidden">
          <img src={image} className="w-[640px] h-[360px]" alt="hey" />
          <Draggable defaultPosition={{x:0, y:-360}} bounds="parent" nodeRef={nodeRef} onDrag={handleDrag}>
            <div
              ref={nodeRef}
              className=" w-24 h-24 text-teal-300 border-teal-300 border-8 p-4"
            >
              {position.x} {position.y}
            </div>
          </Draggable>
        </div>
      )}
    </>
  );
}
