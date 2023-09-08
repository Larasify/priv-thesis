import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>CATER Web Interface</title>
        <meta
          name="description"
          content="Visual tracking of animals in the wild with
user friendly web client"
        />
        <link rel="icon" href={"/favicon.ico"} />
      </Head>
      <Toaster position="bottom-center" />
      <Component {...pageProps} />
    </>
  );
}
