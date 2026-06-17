import { Star } from "lucide-react";
import { Button } from "../ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/drawer";

function NotationAside() {
  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button className="text-white font-semibold bg-secondary">
          <Star /> Evaluer le profil
        </Button>
      </DrawerTrigger>
      <DrawerContent className="border-l border-border">
        <DrawerHeader>
          <DrawerTitle>Evaluer le profil</DrawerTitle>
        </DrawerHeader>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default NotationAside