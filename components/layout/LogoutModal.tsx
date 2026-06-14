"use client";

import { LogOut } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { VisuallyHidden } from "@/components/ui/visually-hidden";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="rounded-2xl max-w-md p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="size-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
            <LogOut size={24} />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">
              Se déconnecter ?
            </h2>
            <p className="text-xs text-slate-500">
              Êtes-vous sûr de vouloir vous déconnecter ? Vous devrez vous reconnecter pour accéder à votre compte.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors text-sm"
            >
              Annuler
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 rounded-xl font-bold bg-red-600 hover:bg-red-700 text-white transition-colors text-sm"
            >
              Se déconnecter
            </button>
          </div>
        </div>

        {/* VisuallyHidden pour l'accessibilité - requis par shadcn */}
        <VisuallyHidden>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmation de déconnexion</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action va vous déconnecter de votre compte
            </AlertDialogDescription>
          </AlertDialogHeader>
        </VisuallyHidden>
      </AlertDialogContent>
    </AlertDialog>
  );
}