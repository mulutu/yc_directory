import Link from "next/link";
import React from "react";
import Image from "next/image";
import { auth, signIn, signOut } from "@/auth";
import { LogOut } from "lucide-react";

const Navbar = async () => {
  const session = await auth();

  return (
    <header className="px-5 py-3 bg-white shadow-sm font-work-sans">
      <nav className="flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-800">
          <Image src="/logo.png" alt="Logo" width={144} height={30} />
        </Link>

        <div className="flex items-center gap-5 text-black">
          {session && session?.user ? (
            <>
              <Link href="/startup/create">
                <span>Create</span>
              </Link>

              <button
                onClick={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <span className="max-sm:hidden">Logout</span>
                <LogOut className="size-6 sm:hidden text-red-500" />
              </button>

              <Link href={`/user/${session?.user?.id}`}>
                <span>{session?.user?.name}</span>
              </Link>
            </>
          ) : (
            <button
              onClick={async () => {
                "use server";
                await signIn("github"); // or any other provider
              }}
            >
              <span>Login</span>
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
