"use client";

import { useRouter } from "next/navigation";
import AnnuairePage from "@/components/catalogues/AnnuairePage";


function Page() {
  const router = useRouter();

  return (
    <AnnuairePage
      type="collecteurs"
      onBack={() => {
        router.push("/f");
      }}
    />
  );
}

export default Page;
