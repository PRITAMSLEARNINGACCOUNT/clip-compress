"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Loader from "@/components/Loader";
import { CreateUser, getAccess, getFileSize } from "../server/Server_Actions";
import { getCldVideoUrl, getCldImageUrl } from "next-cloudinary";
import { ArrowRight, Download, Shrink } from "lucide-react";
import { filesize } from "filesize";
import Alert from "@/components/Alert";
const Dashboard = () => {
  const [File, setFile] = useState<File | null>(null);
  const [Encoding, setEncoding] = useState<string>("H.264");
  const [Format, setFormat] = useState<string>("MP4");
  const [Loading, setLoading] = useState<boolean>(false);
  const [ThumbnailUrl, setThumbnailUrl] = useState<string>("");
  const [Hover, setHover] = useState<boolean>(false);
  const [PreviewURL, setPreviewURL] = useState<string | null>(null);
  const [VideoURL, setVideoURL] = useState<string | null>(null);
  const [OriginalSize, setOriginalSize] = useState<string | null>(null);
  const [CompressedSize, setCompressedSize] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState<boolean>(false);
  const [CompressionRate, setCompressionRate] = useState<number>(0);
  const [AlertMessage, setAlertMessage] = useState<string | null>(null);

  async function HandleCompress() {
    setLoading(true);
    const Access_Result = await getAccess();
    if (Access_Result.success) {
      try {
        const MAX_FILE_SIZE = await getFileSize();
        if (File?.type.includes("video")) {
          if (File.size > MAX_FILE_SIZE) {
            console.log("File too large,Upgrade Your Plan");
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

          setThumbnailUrl(
            getCldImageUrl({
              src: data.publicId,
              width: 400,
              height: 225,
              crop: "fill",
              gravity: "auto",
              format: "jpg",
              quality: "auto",
              assetType: "video",
            })
          );
          setPreviewURL(
            getCldVideoUrl({
              src: data.publicId,
              width: 400,
              height: 225,
              rawTransformations: [
                "e_preview:duration_15:max_seg_9:min_seg_dur_1",
              ],
            })
          );

          setVideoURL(
            getCldVideoUrl({
              src: data.publicId,
              width: 1920,
              height: 1080,
            })
          );
          setCompressionRate(
            Math.round(
              (1 - Number(data.compressedSize) / Number(data.originalSize)) *
                100
            )
          );
          setOriginalSize(filesize(data.originalSize));
          setCompressedSize(filesize(data.compressedSize));
          return;
        } else {
          console.log("Invalid File");
          setAlertMessage("Invalid File");
          return;
        }
      } catch (error) {
        setAlertMessage("Internal Server Error");
        console.log(error);
        return;
      } finally {
        setLoading(false);
      }
    } else {
      setAlertMessage(Access_Result.message);
      setLoading(false);
      return;
    }
  }
  useEffect(() => {
    CreateUser();
  }, []);
  async function HandleDownload() {
    const response = await fetch(VideoURL as string);
    const data = await response.blob();
    const url = URL.createObjectURL(data);
    const link = document.createElement("a");
    link.href = url;
    link.download = `CompressedVideo.${Format.toLowerCase()}`;
    link.click();
  }
  return (
    <div>
      {AlertMessage && <Alert message={AlertMessage as string} />}
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
        {Loading ? (
          <Loader />
        ) : ThumbnailUrl.length > 0 ? (
          <div
            onMouseEnter={() => {
              setHover(true);
            }}
            onMouseLeave={() => {
              setHover(false);
            }}
            className="h-[500px] w-[400px] max-h-[500px] max-w-[400px] m-5 mb-10 card bg-base-100 shadow-lg shadow-gray-700 border-opacity-20 border border-yellow-600 cursor-pointer"
          >
            <figure className="h-[230px] w-[400px] max-h-[230px] max-w-[400px]">
              {!Hover ? (
                <Image
                  src={
                    ThumbnailUrl.length > 0
                      ? ThumbnailUrl
                      : "/public/ClipCompressLogo.jpg"
                  }
                  alt="ThumbnailURL"
                  width={400}
                  height={225}
                  className="rounded-lg w-full h-full object-cover"
                />
              ) : previewError ? (
                <Image
                  src="/No_Preview_Available.webp"
                  alt="No_Preview_Available_Image"
                  width={400}
                  height={225}
                  className="rounded-lg w-full h-full object-cover"
                />
              ) : (
                <video
                  height={225}
                  width={400}
                  src={PreviewURL as string}
                  autoPlay
                  muted
                  loop
                  className="w-full h-full object-cover"
                  onError={() => {
                    setPreviewError(true);
                  }}
                />
              )}
            </figure>
            <div className="card-body">
              <div className="flex justify-between">
                <h2 className="card-title">Compressed Video</h2>
                <h2 className="font-bold">{Encoding}</h2>
              </div>
              <div className="flex justify-between p-5">
                <div className="flex flex-col text-center">
                  <p>Original Size</p>
                  <p>{OriginalSize}</p>
                </div>
                <div className="flex flex-col text-center">
                  <ArrowRight size={20} className="mr-2" />
                  <p>{CompressionRate + " "} %</p>
                </div>
                <div className="flex flex-col text-center">
                  <p>Compressed Size</p>
                  <p>{CompressedSize}</p>
                </div>
              </div>
              <div className="card-actions justify-end">
                <button onClick={HandleDownload} className="btn btn-primary">
                  <Download size={20} className="mr-2" />
                  Download Now
                </button>
              </div>
            </div>
          </div>
        ) : (
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
              <button
                onClick={HandleCompress}
                className="btn btn-outline btn-success"
              >
                <Shrink size={20} className="mr-2" />
                Compress Video
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
