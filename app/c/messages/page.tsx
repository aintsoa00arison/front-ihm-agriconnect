import AutoResizeTextarea from "@/components/chat/AutoResizeTextarea";
import Discussions from "@/components/chat/Discussions";
import Header from "@/components/chat/Header";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SearchIcon } from "lucide-react";
import Image from "next/image";

function page() {
  return (
    <div className="flex gap-5 h-full overflow-hidden p-1">
      <aside className="w-sm rounded-lg bg-white shadow-sm p-4 px-2 pr-0 flex flex-col min-h-0 shrink-0">
        <div className="mb-4 shrink-0 px-4">
          <h2 className="text-2xl font-semibold mb-4">Discussions</h2>
          <InputGroup>
            <InputGroupInput placeholder="Rechercher..." />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>
        </div>
        {/* Liste de toutes les discussions*/}
        <Discussions />
      </aside>

      {/* Content d'une discussion */}
      <main className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden grid grid-rows-[auto_1fr_auto] min-w-0">
        <Header />
        <div></div>
        <div className="p-4 bg-card min-w-0 flex items-end gap-3">
          <AutoResizeTextarea />
          <button
            className="size-10 flex items-center justify-center hover:bg-neutral-200/50 px-2 hover:cursor-pointer rounded-lg transition-colors duration-300"
            aria-label="Envoyer"
          >
            <Image
              src="/icons/envoyer.png"
              alt="Envoyer"
              width={24}
              height={24}
            />
          </button>
        </div>
      </main>
    </div>
  );
}

export default page;
