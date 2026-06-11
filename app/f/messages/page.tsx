import Discussions from "@/components/chat/Discussions";
import Header from "@/components/chat/Header";
import MessageInput from "@/components/chat/MessageInput";
import MessageList from "@/components/chat/MessageList";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SearchIcon } from "lucide-react";

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
        <Discussions />
      </aside>

      <main className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden grid grid-rows-[auto_1fr_auto] min-w-0">
        <Header />
        <MessageList />
        <MessageInput />
      </main>
    </div>
  );
}

export default page;
