import { useRouter } from "next/router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";

export default function PanoramaButton(props: { id: string | string[] }) {
  const [generatingPanorama, setGeneratingPanorama] = useState(false);
  const [panorama, setPanorama] = useState(null);
  const id = props.id;

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
          setPanorama(res.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  return (
    <>
      {!panorama && (
        <button
          className="btn btn-neutral"
          disabled={generatingPanorama}
          onClick={() => {
            setGeneratingPanorama(true);
            fetch("/api/generatepanorama2", {
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
                console.log(res);

                toast.success("Successfully Began Generating Panorama", {
                  style: {
                    borderRadius: "10px",
                    background: "#333",
                    color: "#fff",
                  },
                });
              })
              .catch((err) => {
                console.log(err);
              })
          }}
        >
          {generatingPanorama && <div className="loading"></div>}
          Generate Panorama
        </button>
      )}
      {panorama && (
        <button
          className="btn btn-neutral"
          onClick={() => {
            window.open(panorama);
          }}
        >
          Open Panorama
        </button>
      )}
    </>
  );
}
