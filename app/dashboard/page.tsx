"use client";
import { useState } from "react";
import Image from "next/image";
import Loader from "@/components/Loader";
const Dashboard = () => {
  const [File, setFile] = useState<File | null>(null);
  const [Encoding, setEncoding] = useState<string>("H.264");
  const [Format, setFormat] = useState<string>("MP4");
  const [Loading, setLoading] = useState<boolean>(false);
  async function HandleCompress() {
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    console.log(File, Encoding, Format);
    if (File?.type.includes("video")) {
      if (File.size > MAX_FILE_SIZE) {
        console.log("File too large");
        return;
      }
      const formData = new FormData();
      formData.append("File", File);
      formData.append("Encoding", Encoding);
      formData.append("Format", Format);

      const response = await fetch("/api/Video_Upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log(data);
    } else {
      console.log("Invalid File");
    }
  }
  return (
    <div>
      <div className="flex gap-5 items-center flex-col mt-10">
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
        <p className="text-lg">
          Let&apos;s Start Playing Around With The Videos
        </p>
        <Image
          src="/VideoCompression.webp"
          alt="VideoCompression Image"
          width={600}
          height={600}
          className="rounded-lg p-5 md:p-0"
        />
        <div className="mt-5 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="VideoFile" className="text-lg font-medium">
              Select The Video
            </label>
            <input
              onChange={(e) => {
                setFile(e.target.files![0]);
              }}
              name="VideoFile"
              id="VideoFile"
              type="file"
              className="file-input file-input-bordered file-input-info w-full max-w-xs"
            />
          </div>
          <div className="flex gap-2 w-full">
            <select
              onChange={(e) => {
                setFormat(e.target.value);
              }}
              defaultValue={"MP4"}
              className="select select-bordered w-[50%]"
            >
              <option>MP4</option>
              <option>MKV</option>
            </select>
            <select
              onChange={(e) => {
                setEncoding(e.target.value);
              }}
              defaultValue={"H.264"}
              className="select select-bordered w-[50%]"
            >
              <option>H.264</option>
              <option>H.265</option>
            </select>
          </div>
          <div className="w-full flex justify-center">
            {/* <button className="btn btn-square btn-success">
              <span className="loading loading-spinner"></span>
            </button> */}

            {/* <Loader /> */}
            <button
              onClick={HandleCompress}
              className="btn btn-outline btn-success"
            >
              {/* <Compress className="mr-2" /> */}
              Compress Video
            </button>
          </div>
        </div>

        {/* <div className="mt-28 card bg-base-100 w-96 shadow-xl">
          <figure>
            <img
              src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
              alt="Shoes"
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title">Shoes!</h2>
            <p>If a dog chews shoes whose shoes does he choose?</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary">Download Now</button>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Dashboard;
