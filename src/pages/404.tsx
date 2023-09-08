import Link from "next/link";
import { useRouter } from "next/router";

export default function fourohofour() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();


  return (
    <div className="m-auto flex h-screen text-center max-w-lg flex-col items-center justify-center align-middle gap-2">
      <div className=" font-mono text-neutral-500 font-bold flex flex-col gap-4">
        <span className=" text-8xl">404</span>
        The page you are looking for could not be found 
      </div>
      <Link href="/">
        <div className="btn btn-neutral">Home</div>{" "}
      </Link>
    </div>
  );
}
