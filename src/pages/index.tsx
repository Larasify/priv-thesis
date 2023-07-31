import React, { useRef } from "react";

import dynamic from "next/dynamic";

import captureVideoFrame from "../helpers/capturevideoframe";

import { ReactPlayerProps } from "react-player";

import Draggable from "react-draggable";

const ReactPlayer = dynamic(() => import("../helpers/ReactPlayerWrapper"), {
  ssr: false,
});

export default function Home() {
  const [playing, isPlaying] = React.useState(false);
  const playerRef = useRef<ReactPlayerProps>(null);
  const [image, setImage] = React.useState(null);
  const nodeRef = React.useRef(null);

  const [position, setPosition] = React.useState({ x: 0, y: 0 });

  const handleDrag = (e: any, ui: { deltaX: number; deltaY: number; }) => {
    const { x, y } = position;
    setPosition({
      x: x + ui.deltaX,
      y: y + ui.deltaY,
    });
  };


  if (playerRef && playerRef.current) {
    console.log(playerRef.current);
  }
  return (
    <>
      <ReactPlayer
        playerRef={playerRef}
        playing={playing}
        url="/testvideo.mp4"
      />
      <div>hi {playing}</div>
      <button onClick={() => isPlaying(true)}>Boop</button>
      <button onClick={() => isPlaying(false)}>Boop2</button>
      <button
        onClick={() => {
          const frame = captureVideoFrame(
            playerRef.current?.getInternalPlayer()
          );
          console.log(frame);
          setImage(frame.dataUri);
        }}
      >
        Boop3
      </button>
      {image && <img src={image} width={640} height={360} />}

      <Draggable nodeRef={nodeRef} onDrag={handleDrag}>
        <div ref={nodeRef}>I can be dragged anywhere {position.x} {position.y}</div>
      </Draggable>
    </>
  );
}
