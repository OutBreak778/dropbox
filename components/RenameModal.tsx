"use client";

import { useAppStore } from "@/store/store";
import { useUser } from "@clerk/nextjs";
import React, { useState } from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "next/navigation";
import { toast, useToast } from "./ui/use-toast";

const RenameModal = () => {
  const { user } = useUser();
  const [input, setInput] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const [
    setFieldId,
    RenameModal,
    setRenameModal,
    setDeleteModal,
    fieldId,
    filename,
  ] = useAppStore((state) => [
    state.setFieldId,
    state.RenameModal,
    state.setRenameModal,
    state.setDeleteModal,
    state.fieldId,
    state.filename,
  ]);
  const renameFile = async () => {
    if (!user || !fieldId) return;

    try {
      await updateDoc(doc(db, "users", user.id, "files", fieldId), {
        filename: input,
      })
      toast({
        description: "Renamed successfully",
        variant: "default",
      });
    } catch (error) {
      console.log(error);
      toast({
        description: "Error occured",
        variant: "destructive",
      });
    }

    setInput("");
    router.refresh();
    setRenameModal(false);
  };

  return (
    <Dialog
      open={RenameModal}
      onOpenChange={(isOpen) => {
        setDeleteModal(isOpen);
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rename File</DialogTitle>
          <Input
            id="link"
            defaultValue={filename}
            onChange={(e) => setInput(e.target.value)}
            onKeyDownCapture={(e) => {
              if (e.key === "Enter") {
                renameFile();
              }
            }}
          />
        </DialogHeader>
        <div className="flex space-x-8 py-4">
          <Button
            size="sm"
            className="px-3 flex-1"
            variant="ghost"
            onClick={() => setRenameModal(false)}
          >
            <span className="sr-only">Cancel</span>
            <span>Cancel</span>
          </Button>
          <Button
            type="submit"
            size="sm"
            className="px-3 flex-1"
            variant="default"
            onClick={() => renameFile()}
          >
            <span className="sr-only">Rename</span>
            <span>Rename</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RenameModal;
