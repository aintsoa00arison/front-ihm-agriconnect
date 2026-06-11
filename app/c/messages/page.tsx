import Discussions from "@/components/chat/Discussions";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SearchIcon } from "lucide-react";

function page() {
  return (
    <div className="flex gap-5 h-full">
      <aside className="w-sm rounded-lg bg-white shadow-sm p-4 px-2 pr-0 flex flex-col min-h-0">
        {" "}
        {/* + flex flex-col min-h-0 */}
        <div className="mb-4 shrink-0 px-4">
          {" "}
          {/* shrink-0 pour que le header ne se compresse pas */}
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
      <main className="flex-1 flex bg-white rounded-lg shadow-sm">
        <div className="flex-1">
          {/* Notation
          <Drawer direction="right">
            <DrawerTrigger>Noter</DrawerTrigger>
            <DrawerContent className="border-l border-border">
              <DrawerHeader>
                <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                <DrawerDescription>
                  This action cannot be undone.
                </DrawerDescription>
              </DrawerHeader>
              <DrawerFooter>
                <Button>Submit</Button>
                <DrawerClose>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer> */}
        </div>
      </main>
    </div>
  );
}

export default page;
