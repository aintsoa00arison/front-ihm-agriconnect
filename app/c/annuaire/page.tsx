"use client";

import { useRouter } from "next/navigation";
import AnnuairePage from "@/components/catalogues/AnnuairePage";


function Page() {
  const router = useRouter();

  return (
    <AnnuairePage
      type="fournisseurs"
      onBack={() => {
        router.push("/c");
      }}
    />
  );
}

export default Page;
