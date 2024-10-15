"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
      <main className="w-screen relative flex h-full items-center justify-center flex-col">
        {"Unieventos"}
        <button onClick={() => { router.push("/auth") }} type="button" >
          Continuar
        </button>
      </main>
  );
}
