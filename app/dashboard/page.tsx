import Image from "next/image";
const Dashboard = () => {
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
              name="VideoFile"
              id="VideoFile"
              type="file"
              className="file-input file-input-bordered file-input-info w-full max-w-xs"
            />
          </div>
          <div className="flex gap-2 w-full">
            <select
              defaultValue={"MP4"}
              className="select select-bordered w-[50%]"
            >
              <option>MP4</option>
              <option>MKV</option>
            </select>
            <select
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

            <button className="btn btn-outline btn-success">
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
