import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import Image from "next/image"; // Import the Image component from the appropriate library
import Link from "next/link";
import markdownit from "markdown-it";
import { Skeleton } from "@/components/ui/skeleton";
import View from "@/components/View";

const md = new markdownit();

import { prisma } from '@/lib/prisma';

export const experimental_ppr = true;

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const startupId = Number(id);

  const startup = await prisma.startup.findUnique({
    where: { id: startupId },
    include: { author: true },
  });

  console.log("Startup", startup);

  if (!startup) {
    return notFound();
  }

  const parsedContent = md.render(startup?.pitch || ""); // Parse the pitch content using markdown-it

  return (
    <>
      <section className="pink_container !min-h-[230px]">
        <p className="tag">{formatDate(startup?.createdAt.toString())}</p>
        <h1 className="heading">{startup.title}</h1>
        <p className="sub-heading !max-w-5xl">{startup.description}</p>
      </section>

      <section className="section_container">
        <Image
          src={startup.image}
          alt={startup.title} // Access the 'name' property of the 'author' object
          className="w-full h-auto rounded-xl"
          width={300} // Specify the width of the image
          height={200} // Specify the height of the image
        />
        <div className="space-y-5 mt-10 max-w-4xl mx-auto">
          <div className="flex-between gap-5">
            <Link
              href={`/user/${startup.author?.id}`}
              className="flex gap-2 items-center mb-3"
            >
              <Image
                src={startup.author.image}
                alt="avatar"
                width={64}
                height={64}
                className="rounded-full drop-shadow-lg"
              />

              <div>
                <p className="text-20-medium">{startup.author.name}</p>
                <p className="text-16-medium !text-black-300">
                  @{startup.author.username}
                </p>
              </div>
            </Link>

            <p className="category-tag">{startup.category}</p>
          </div>

          <h3 className="text-30-bold">Pitch Details</h3>
         {parsedContent ? (
            <article
              className="prose max-w-4xl font-work-sans break-all"
              dangerouslySetInnerHTML={{ __html: parsedContent }}
            />
          ) : (
            <p className="no-result">No details provided</p>
          )}
        </div>

        <hr className="divider" />

        <Suspense fallback={<Skeleton className="view_skeleton" />}>
          <View id={id} />
        </Suspense>

      </section>
    </>
  );
};

export default page;
