"use client";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '../ui/drawer';
import { Button } from '../ui/button';
import { Star } from 'lucide-react';
import Image from 'next/image';

function Header() {
  return (
    <header className="flex justify-between px-4 py-2 h-14 bg-card items-center  border-b border-border">
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="shrink-0 relative">
          <Image
            src="/images/default-avatar.jpg"
            alt="Nom de la discussion"
            width={35}
            height={35}
            className="rounded-full"
          />
          <span className="absolute bottom-0 right-0 size-3 bg-green-500 border-2 border-white rounded-full" />
        </div>
        {/* Nom de l'interlocuteur */}
        <h3 className="font-semibold">John Doe</h3>
      </div>
      <Drawer direction="right">
        <DrawerTrigger>
          <Button className="text-white font-semibold bg-secondary">
            <Star /> Evaluer le profil
          </Button>
        </DrawerTrigger>
        <DrawerContent className="border-l border-border">
          <DrawerHeader>
            <DrawerTitle>Are you absolutely sure?</DrawerTitle>
            <DrawerDescription>This action cannot be undone.</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </header>
  );
}

export default Header