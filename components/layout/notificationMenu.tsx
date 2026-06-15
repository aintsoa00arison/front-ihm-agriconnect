"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, X, Handshake, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


const notifications = [
  {
    id: 1,
    type: "business",
    title: "Entreprise Bio",
    content: (
      <>
        est intéressée par votre annonce{" "}
        <span className="text-primary font-bold">Riz Bio ( 5 tonnes ).</span>
      </>
    ),
    time: "Il y a 15 minutes",
    isNew: true,
    icon: <Handshake className="text-primary w-6 h-6" />,
  },
  {
    id: 2,
    type: "message",
    title: "Rasoa Be",
    content:
      "“ Bonjour, je voulais discuter un peu plus sur la livraison .Comment il se fait et ...”",
    time: "1 h",
    isNew: false,
    avatar: "https://api.dicebear.com/9.x/big-ears-neutral/svg?seed=Destiny",
    action: "Répondre",
  },
  {
    id: 3,
    type: "demand",
    title: "Rasoa Be",
    content: "a fait une demande qui pourrait vous intéresser.",
    time: "Il y a 15 minutes",
    isNew: false,
    avatar: "https://api.dicebear.com/9.x/big-smile/svg?seed=Ryker",
    action: "Voir",
  },
];

export function NotificationMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-neutral border-none size-11 relative hover:bg-input-border/20 transition-colors"
        >
          {/* Badge point rouge sur la cloche */}
          <span className="absolute top-2.5 right-2.5 block h-2.5 w-2.5 rounded-full bg-red-600 border-2 border-white ring-1 ring-red-600/20"></span>
          <Bell className="w-6 h-6 text-label" fill="currentColor" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="sm:w-105  w-85 p-0 overflow-hidden rounded-xl border-separator/30 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-separator/20 bg-white">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-extrabold text-label">Notifications</h2>
            <span className="bg-secondary text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
              1 nouvelle(s)
            </span>
          </div>
        </div>

        {/* Liste de notifications (fictive) */}
        <div className="max-h-125 overflow-y-auto">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={cn(
                "relative flex gap-4 px-5 py-5 border-b border-separator/10 transition-colors hover:bg-neutral/30 cursor-pointer",
                notif.isNew && "bg-light-bg/20",
              )}
            >
              {/* Indicateur de nouveau */}
              {notif.isNew && (
                <div className="absolute left-0 top-4 bottom-4 w-1 bg-primary rounded-r-full" />
              )}

              {/* ICON OU AVATAR */}
              <div className="shrink-0">
                {notif.type === "business" ? (
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    {notif.icon}
                  </div>
                ) : (
                  <Avatar>
                    <AvatarImage
                      src={notif.avatar}
                      alt="shadcn"
                    />
                    <AvatarFallback>LR</AvatarFallback>
                  </Avatar>
                )}
              </div>

              {/* CONTENU */}
              <div className="flex flex-col gap-1 flex-1">
                <div className="flex justify-between items-start gap-2">
                  <h3
                    className={cn(
                      "font-bold text-[15px] leading-tight",
                      notif.isNew ? "text-label" : "text-label/80",
                    )}
                  >
                    {notif.title}
                  </h3>
                  <span className="text-[12px] text-muted-foreground whitespace-nowrap font-medium">
                    {notif.time}
                  </span>
                </div>

                <p
                  className={cn(
                    "text-[14px] leading-snug mb-1",
                    notif.isNew
                      ? "text-label font-medium"
                      : "text-muted-foreground",
                  )}
                >
                  {notif.content}
                </p>

                {/* ACTION (Répondre / Voir) */}
                {notif.action && (
                  <button className="flex items-center gap-1.5 text-primary font-bold text-sm mt-1 hover:underline transition-all">
                    {notif.action}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER OPTIONNEL */}
        <div className="p-3 bg-neutral/20 text-center">
          <Button
            variant="ghost"
            className="text-primary font-bold text-sm w-full hover:bg-transparent"
          >
            Tout marquer comme lu
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
