"use client";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Button } from "../ui/button";
import { Star } from "lucide-react";

import Image from "next/image";
import StarAffichage from "./Star";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import BasicRating from "../rating-group";
import { useChat } from "@/app/services/chat/ChatContext";

function Header() {
  const { discussions, activeDiscussionId, currentUserId } = useChat();
  const activeChat = discussions.find((d) => d.id === activeDiscussionId);
  const name =
    activeChat?.entreprise_legal_name ||
    `${activeChat?.interlocutor_first_name || ""} ${activeChat?.interlocutor_last_name || ""}`.trim() ||
    "Sélectionnez une discussion";

  return (
    <header className="flex justify-between px-4 py-2 h-14 bg-card items-center  border-b border-border">
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="shrink-0 relative">
          <Image
            src={activeChat?.interlocutor_photo || "/images/default-avatar.jpg"}
            alt={name}
            width={35}
            height={35}
            className="rounded-full object-cover"
          />
          <span className="absolute bottom-0 right-0 size-3 bg-green-500 border-2 border-white rounded-full" />
        </div>
        {/* Nom de l'interlocuteur */}
        <h3 className="font-semibold">{name}</h3>
      </div>
      {activeDiscussionId && (
        <Drawer direction="right">
          <DrawerTrigger asChild>
            <Button className="text-white font-semibold bg-secondary">
              <Star /> Evaluer le profil
            </Button>
          </DrawerTrigger>
          <DrawerContent className="border-l border-border rounded-none">
            <DrawerHeader>
              <DrawerTitle className="text-xl font-semibold">
                Evaluer le profil
              </DrawerTitle>
            </DrawerHeader>
            <div className="p-4 scrollbar-none overflow-y-auto flex flex-col gap-4 justify-center items-center h-full ">
              <div className="flex flex-col items-center mb-8">
                <Image
                  src="/images/default-avatar.jpg"
                  alt={"avatar de " + name}
                  width={100}
                  height={100}
                  className="rounded-full"
                />
                <p className="text-center mt-2 text-xl font-bold">{name}</p>
              </div>

              {/* <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Bio</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground font-semibold">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Et
                    impedit deleniti eaque dolore veritatis ipsam debitis minima
                    iste rerum? Porro, natus! Consequatur qui vel maiores vitae
                    reiciendis iste sunt ipsum.
                  </p>
                </CardContent>
              </Card> */}
              <BasicRating
                assessorId={currentUserId ?? ""}
                assesseeId={activeChat?.interlocutor_id ?? ""}
              />
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </header>
  );
}

export default Header;
