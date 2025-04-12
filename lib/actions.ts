"use server";

import { auth } from "@/auth";
import { parseServerActionResponse } from "@/lib/utils";
import slugify from "slugify";
//import { writeClient } from "@/sanity/lib/write-client";

import { prisma } from "@/lib/prisma";

export const createPitch = async (
  state: any,
  form: FormData,
  pitch: string
) => {
  const session = await auth();

  if (!session)
    return parseServerActionResponse({
      error: "Not signed in",
      status: "ERROR",
    });

  const { title, description, category, link } = Object.fromEntries(
    Array.from(form).filter(([key]) => key !== "pitch")
  ) ;

  const slug = slugify(title as string, { lower: true, strict: true });

  try {
    /*const startup = {
      title,
      description,
      category,
      image: link,
      slug: {
        _type: slug,
        current: slug,
      },
      author: {
        _type: "reference",
        _ref: session?.id,
      },
      pitch,
    };*/

    //const result = await writeClient.create({ _type: "startup", ...startup });
    const result = await prisma.startup.create({
      data: {
        title,
        description,
        category,
        image: link,
        slug,
        //authorId: session?.id,
        pitch,
        views: 0,
        author: {
          connect: {
            id: session?.id
          }
        }
      },
    });
    console.log("Result", result);

    return parseServerActionResponse({
      ...result,
      error: "",
      status: "SUCCESS",
    });
  } catch (error) {
    console.log(error);

    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: "ERROR",
    });
  }
};
