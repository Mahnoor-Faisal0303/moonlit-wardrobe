import type { ReactNode } from "react";
import Avatar3D from "./Avatar3D";

export default function AuthShell({ tagline, children }: { tagline: string; children: ReactNode }) {
  return (
    <main className="mx-auto grid min-h-screen w-full max-w-[1400px] items-center gap-12 px-6 py-12 lg:grid-cols-2 lg:px-16">
      <section className="flex flex-col items-center text-center">
        <Avatar3D />
        <h2 className="mt-14 max-w-md text-2xl font-semibold leading-snug sm:text-3xl">{tagline}</h2>
      </section>
      <section className="flex justify-center lg:justify-end">{children}</section>
    </main>
  );
}
