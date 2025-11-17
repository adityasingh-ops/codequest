import Image from "next/image";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center text-center">
        <Image
          src="/logo.png"
          alt="CodeQuest logo"
          width={160}
          height={160}
          priority
          className="rounded-2xl shadow-lg"
        />
        <h1 className="text-3xl font-bold tracking-tight text-white">
          CodeQuest – Competitive Coding Tracker
        </h1>
        <p className="max-w-2xl text-sm text-gray-400">
          Track your progress across LeetCode, Codeforces, and CodeChef. Build custom tracks,
          create team sheets, race with friends, and sharpen your DSA skills.
        </p>
      </main>
    </div>
  );
}
