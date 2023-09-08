import {
  SiNextdotjs,
  SiPlanetscale,
  SiPrisma,
  SiRailway,
  SiReact,
  SiSocketdotio,
  SiTailwindcss,
  SiTrpc,
  SiTypescript,
  SiVercel,
  SiYoutube,
} from "react-icons/si";
import clsx from "clsx";
import Link from "next/link";
import { FaDownload, FaHome } from "react-icons/fa";

export default function About() {
  return (
    <div className=" flex h-full items-center p-10 pt-24 font-mono text-lg font-semibold text-neutral-500 max-w-4xl mx-auto">
      <div className="flex flex-col gap-10">
        <span>
          This project was done as a thesis project for the University of
          Sheffield by Eylül Lara Çıkış
        </span>
        <div className="flex flex-col gap-2 text-4xl text-stone-400">
          <span className="text-lg font-semibold text-neutral-500">
            Built with
          </span>
          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-5">
              <SiNextdotjs /> Next.js
            </div>
            <div className="flex flex-row gap-5">
              <SiTailwindcss /> Tailwind CSS
            </div>
            <div className="flex flex-row gap-5">
              <SiReact /> React
            </div>
            <div className="flex flex-row gap-5">
              <SiTypescript /> Typescript
            </div>
            <span className="text-sm text-red-500">❤️</span>
          </div>
        </div>
        <Link
          href="https://cater.cvmls.org/"
          className="text-stone-400 hover:text-primary w-max"
        >
          Check out CATER
        </Link>

        <Link
          href="https://www.youtube.com/channel/UCEq3lmqb56v6azWiaE-bSrw"
          className="text-stone-400 hover:text-primary w-max flex flex-row gap-2 items-center"
        >
          <SiYoutube /> Demo Video
        </Link>

        <Link
          href="/thesis.pdf"
          className="text-stone-400 hover:text-primary w-max flex flex-row gap-2 items-center"
        >
          <FaDownload /> Download Thesis
        </Link>

        <Link href="/">
          <div className="btn btn-neutral">
            <FaHome /> Home
          </div>
        </Link>
      </div>
    </div>
  );
}
