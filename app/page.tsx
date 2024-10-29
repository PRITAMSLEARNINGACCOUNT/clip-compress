"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import Typed from "typed.js";

export default function Home() {
  const el = React.useRef(null);

  React.useEffect(() => {
    const typed = new Typed(el.current, {
      strings: [
        "Compress your videos with ease!",
        "Sign in or Sign up to get started.",
        "Fast and efficient video compression.",
        "Reduce video size without losing quality.",
        "Join ClipCompress today!",
      ],
      typeSpeed: 50,
      backSpeed: 50,
      loop: true,
    });

    return () => {
      // Destroy Typed instance during cleanup to stop animation
      typed.destroy();
    };
  }, []);
  return (
    <div>
      <div className="flex gap-3 items-center flex-col mt-10">
        <h1 className="text-2xl font-bold flex justify-center items-center gap-3">
          Welcome to ClipCompress{" "}
          <span>
            <Image
              src="/ClipCompressLogo.jpg"
              alt="ClipCompress Logo"
              width={50}
              height={50}
              className="rounded-full"
            />
          </span>
        </h1>
        <p className="text-lg font-medium">
          Let&apos;s Start Playing Around With The Videos
        </p>
        <Image
          src="/VideoCompression.webp"
          alt="VideoCompression Image"
          width={600}
          height={600}
          className="rounded-lg p-5 md:p-0"
        />
        <Link href={"sign-in"} className="text-lg font-medium hover:underline">
          <span ref={el}></span>
        </Link>
      </div>
      <hr className="opacity-10 mt-10" />
      <div className="mt-5 p-10 md:p-0">
        <h3 className="text-center text-2xl font-bold underline">
          A Small Description Of ClipCompress
        </h3>
        <p className="text-lg md:pr-20 md:pl-20 pt-10 text-center">
          Clip-Compress is an innovative, user-friendly web application tailored
          to streamline video management for both personal and professional
          users. Offering powerful tools to compress large video files,
          Clip-Compress enables users to reduce file sizes significantly without
          sacrificing quality, making storage and sharing hassle-free. The app
          also features advanced capabilities to seamlessly convert video
          formats, ensuring compatibility across different devices and
          platforms. Additionally, Clip-Compress provides encoding
          customization, allowing users to adjust video encoding parameters for
          optimal playback, quality control, and file size management. Designed
          to be intuitive and efficient, Clip-Compress is the go-to solution for
          anyone needing a quick, effective, and flexible video processing tool
          in one accessible platform
        </p>
      </div>
    </div>
  );
}
