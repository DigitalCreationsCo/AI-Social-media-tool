import Image from "next/image";
import { Inter } from "next/font/google";
import SocialMediaPoster from "@/components/SocialMediaPoster";
import SocialToolBar from "@/components/SocialToolBar";
import { useState } from "react";
import ImageDescriptionComponent from "@/components/ImageDescriptionComponent";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {

  const [error, setError] = useState('');


  return (
    <main
      className={`flex min-h-screen flex-wrap items-center gap-20 p-24 ${inter.className}`}
    >
      <div>
       <h1>Social Media Poster</h1>
       <SocialToolBar error={error} setError={setError} />
       <SocialMediaPoster error={error} setError={setError}  />
      </div>

      <div>
        <h2>Describe an image with locally-running ai</h2>
        <ImageDescriptionComponent />
      </div>
    </main>
  );
}
