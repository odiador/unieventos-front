"use client";

import { ModalProvider, useModal } from "@/components/modal";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <ModalProvider>
      <main className="w-screen relative flex min-h-screen items-center justify-center flex-col">
        {"Unieventos"}
        <button onClick={() => { router.push("/auth") }} type="button" >
          Continuar
        </button>
        <NewFunction />
      </main>
    </ModalProvider>
  );
}

function NewFunction() {
  const { openModal } = useModal();

  return (
    <button onClick={() => { openModal("hola hola"); }} type="button">
      Abrir modal
    </button>
  );
}
