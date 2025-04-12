import Ping from "../components/Ping";
import { after } from 'next/server'; // For Next.js 15.1.0 and later

import { prisma } from '@/lib/prisma';

const View = async ({ id }: { id: string }) => {
  const startupId = Number(id);

  // Fetch the current number of views for the startup
  const startup = await prisma.startup.findUnique({
    where: { id: startupId },
    select: { views: true },
  });

  // Default to 0 if not found (or handle as needed)
  const totalViews = startup?.views ?? 0;

  // Asynchronously update the view count in the background
  after(async () => {
    await prisma.startup.update({
      where: { id: startupId },
      data: { views: { increment: 1 } },
    });
  });

  return (
    <div className="view-container">
      <div className="absolute -top-2 -right-2">
        <Ping />
      </div>
      <p className="view-text">
        <span className="font-black">Views: {totalViews}</span>
      </p>
    </div>
  );
};

export default View;
