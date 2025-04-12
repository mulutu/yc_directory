import { auth } from "@/auth";
import SearchForm from "@/components/SearchForm";
import StartupCard from "@/components/StartupCard";

import { prisma } from '@/lib/prisma';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const query = (await searchParams).query;

  /*const posts = await prisma.startup.findMany({
    include: { author: true },
  });*/

  const session = await auth();

  const posts = await prisma.startup.findMany({
    where: query && query.trim() !== "" ? {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { category: { contains: query, mode: "insensitive" } },
        { pitch: { contains: query, mode: "insensitive" } },
        {
          author: {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { username: { contains: query, mode: "insensitive" } },
              { email: { contains: query, mode: "insensitive" } },
            ],
          },
        },
      ],
    } : {},
    include: { author: true },
  });

  return (
    <>
      <section className="pink_container">
        <h1 className="heading">
          Pitch Your Startup, <br /> Connect With Entrepreneurs
        </h1>
        <p className="sub-heading !max-w-3xl">
          Submit Ideas, Vote on Pitches, and Get Noticed in Virtual Pitch
          Competitions
        </p>
        <SearchForm query={query} />
      </section>

      <section className="section_container">
        <p className="text-30-semibold">
          {query ? `Search results for "${query}"` : `All startups`}
        </p>

        <ul className="mt-7 card_grid">
          {posts?.length > 0 ? (
            posts.map((post: StartupCardType, index: number) => (
              <StartupCard key={post?.id} post={post} />
            ))
          ) : (
            <p className="no-results">No startups found</p>
          )}
        </ul>
      </section>
    </>
  );
}
