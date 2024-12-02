"use server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
const Prisma = new PrismaClient();
const { userId } = await auth();
import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
export async function getFileSize() {
  const user = await Prisma.user.findUnique({
    where: {
      id: userId as string,
    },
  });

  const MAX_FILE_SIZE =
    user?.plan === "premium"
      ? 50 * 1024 * 1024
      : user?.plan === "premium plus"
        ? 99 * 1024 * 1024
        : 10 * 1024 * 1024;
  return MAX_FILE_SIZE;
}
export async function CreateUser() {
  try {
    await Prisma.user.create({
      data: {
        id: userId as string,
      },
    });
    return { success: true, message: "User Created Successfully" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Internal Server Error" };
  } finally {
    await Prisma.$disconnect();
  }
}
export async function Cleanup() {
  try {
    const R = await Prisma.video.findMany({
      where: {
        userId: userId as string,
      },
    });
    // console.log(R);

    await cloudinary.api.delete_resources(
      R.map((video) => video.publicId),
      { type: "upload", resource_type: "video" }
    );
    // console.log("Cloudinary Response", C);
    await Prisma.video.deleteMany({
      where: {
        userId: userId as string,
      },
    });
    // console.log(DeleteResult);
    return { success: true, message: "Cleanup Done" };
  } catch (error) {
    // @typescript-eslint/no-unused-vars
    console.log(error);
    return { success: false, message: "Internal Server Error" };
  } finally {
    await Prisma.$disconnect();
  }
}

export async function UserPlanDetails() {
  let planDetails = null;
  try {
    if (userId) {
      const DBResult = await Prisma.user.findUnique({
        where: {
          id: userId as string,
        },
      });
      planDetails = DBResult?.plan as null | string;
    }
    return {
      UserLoggedIn: userId ? true : false,
      planDetails,
    };
  } catch (error) {
    console.log(error);
    return {
      UserLoggedIn: userId ? true : false,
      planDetails,
    };
  } finally {
    await Prisma.$disconnect();
  }
}

export async function UpdatePlan(PlanName: string) {
  try {
    await Prisma.user.update({
      where: {
        id: userId as string,
      },
      data: {
        plan: PlanName.toLowerCase(),
      },
    });
    return { success: true, message: "Plan Updated Successfully" };
  } catch (error) {
    console.log(error);

    return { success: false, message: "Internal Server Error" };
  } finally {
    await Prisma.$disconnect();
  }
}
export async function getAccess() {
  try {
    const DBResult = await Prisma.user.findUnique({
      where: {
        id: userId as string,
      },
    });
    if (
      DBResult?.plan.toLowerCase() === "free" &&
      DBResult?.Video_Compressed >= 5
    ) {
      return {
        success: false,
        message: "Limit Exceeded!!! Please Upgrade Your Plan",
      };
    } else if (
      DBResult?.plan.toLowerCase() === "premium" &&
      DBResult?.Video_Compressed >= 20
    ) {
      return {
        success: false,
        message: "Limit Exceeded!!! Please Upgrade Your Plan",
      };
    } else if (
      DBResult?.plan.toLowerCase() === "premiumm plus" &&
      DBResult?.Video_Compressed >= 50
    ) {
      return {
        success: false,
        message: "Limit Exceeded!!! Please Upgrade Your Plan",
      };
    } else {
      return { success: true, message: "Access Granted" };
    }
  } catch (error) {
    console.log(error);
    return { success: false, message: "Internal Server Error" };
  }
}
