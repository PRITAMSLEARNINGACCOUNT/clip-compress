import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const CLOUDINARY_FOLDER = "ClipCompress";

interface CloudinaryUploadResult {
  public_id: string;
  bytes: number;
  eager?: Array<{
    bytes: number;
    format: string;
    url: string;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    if (
      !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("File") as File | null;
    const Encoding = formData.get("Encoding") as string;
    const Format = formData.get("Format") as string;

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 400 });
    }

    const FileBytes = await file.arrayBuffer();
    const FileBuffer = Buffer.from(FileBytes);

    console.log("Encoding:", Encoding);
    console.log("Format:", Format);

    const transformationFormat = Encoding.includes("H.264")
      ? Format.toLowerCase()
      : "mkv";
    const videoCodec = Encoding.includes("H.264") ? "vc_h264" : "vc_hevc";

    console.log("Transformation Format:", transformationFormat);
    console.log("Video Codec:", videoCodec);

    const result = await new Promise<CloudinaryUploadResult>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "video",
            folder: CLOUDINARY_FOLDER,
            eager: [
              {
                quality: "auto",
                fetch_format: "mp4",
                // video_codec: videoCodec,
              },
            ],
            eager_async: false,
            overwrite: false,
            unique_filename: true,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as CloudinaryUploadResult);
          }
        );
        uploadStream.end(FileBuffer);
      }
    );
    console.log("Cloudinary Response:", result);

    if (!result || !result.public_id) {
      console.error("Invalid Cloudinary response:", result);
      return NextResponse.json(
        { error: "Video upload failed" },
        { status: 500 }
      );
    }

    const { userId } = await auth();

    // Get the compressed size with fallbacks
    const compressedSize =
      result.eager?.[0]?.bytes || result.bytes || file.size;

    const VideoUploadResult = await prisma.video.create({
      data: {
        userId: userId as string,
        publicId: result.public_id,
        originalSize: file.size.toString(),
        compressedSize: compressedSize.toString(),
      },
    });
    await prisma.user.update({
      where: {
        id: userId as string,
      },
      data: {
        Video_Compressed: {
          increment: 1,
        },
      },
    });
    return NextResponse.json(VideoUploadResult);
  } catch (error) {
    console.log("Upload video failed", error);
    return NextResponse.json({ error: "Upload video failed" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
