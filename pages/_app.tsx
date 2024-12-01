import "@/styles/globals.css";
import { startCronJobs } from "@/lib/cron";
import type { AppProps } from "next/app";
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
  startCronJobs();
  
  return <Component {...pageProps} />;
}
