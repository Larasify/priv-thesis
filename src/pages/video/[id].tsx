import { useRouter } from "next/router";
import React, { useRef } from "react";

import dynamic from "next/dynamic";

import captureVideoFrame from "../../helpers/capturevideoframe";

import { ReactPlayerProps } from "react-player";

import Draggable from "react-draggable";

const ReactPlayer = dynamic(() => import("../../helpers/ReactPlayerWrapper"), {
  ssr: false,
});

export default function VideoPage() {
  const router = useRouter();
  const { id } = router.query;

  const [playing, isPlaying] = React.useState(false);
  const playerRef = useRef(null);
  const [image, setImage] = React.useState(null);
  const nodeRef = React.useRef(null);

  const [position, setPosition] = React.useState({ x: 0, y: 0 });

  const handleDrag = (e: any, ui: { deltaX: number; deltaY: number }) => {
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
        url={`/files/${id}.mp4`}
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
      {image && (
        <div className="h-max w-max relative overflow-auto">
          <Draggable bounds="parent" nodeRef={nodeRef} onDrag={handleDrag}>
            <div ref={nodeRef} className="w-max">
              I can be dragged anywhere {position.x} {position.y}
            </div>
          </Draggable>
          <img src={image} width={640} height={360} />
        </div>
      )}
    </>
  );
}
