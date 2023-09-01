import Link from "next/link";
import { useRouter } from "next/router";
import VideoCode from "../Components/VideoCode";

export default function Processing() {
  const router = useRouter();

  const { processingid } = router.query;
  console.log(processingid);

  return (
    <div className="m-auto flex h-screen text-center max-w-lg flex-col items-center justify-center align-middle gap-2">
      <div className="loading loading-lg text-primary"></div>
      <div className=" font-mono text-neutral-500 font-bold">
        Your video is processing please wait for it to be processed and then
        access with your id-code. This may take upwards of 40 minutes depending
        on the length of your video.
        <span className="loading loading-dots loading-xs"></span>
      </div>
      <Link href="/">
        {" "}
        <div className="btn btn-neutral">Home</div>{" "}
      </Link>
      <VideoCode />
    </div>
  );
}
