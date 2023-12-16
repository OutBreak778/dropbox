import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { useAppStore } from "@/store/store";
import { useUser } from "@clerk/nextjs";
import { deleteObject, ref } from "firebase/storage";
import { deleteDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { db, storage } from "@/firebase";
import { toast } from "./ui/use-toast";

export const DeleteModel = () => {
  const { user } = useUser();
  const router = useRouter();

  const [
    fieldId,
    setFieldId,
    DeleteModal,
    setDeleteModal,
    setRenameModal,
    setFilename,
  ] = useAppStore((state) => [
    state.fieldId,
    state.setFieldId,
    state.DeleteModal,
    state.setDeleteModal,
    state.setRenameModal,
    state.setFilename,
  ]);

  const DeleteFile = async () => {
    if (!user || !fieldId) {
      return;
    }
    const fileRef = ref(storage, `users/${user.id}/files/${fieldId}`);

    try {
      await deleteObject(fileRef)
        .then(async () => {
          deleteDoc(doc(db, "users", user.id, "files", fieldId));
        })
      .finally(() => {
          setDeleteModal(false)
        })
        toast({
          description: "Successfully Deleted",
          variant: "default"
        })
    } catch (error) {
      console.log(error)
      toast({
        description: "Something went wrong!",
        variant: "default"
      })
    }

    setDeleteModal(false);
  };
  return (
    <Dialog
      open={DeleteModal}
      onOpenChange={(isOpen) => {
        setDeleteModal(isOpen);
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Are you sure to Delete this file ?</DialogTitle>
          <DialogDescription>This action cannot be undone</DialogDescription>
        </DialogHeader>
        <div className="flex space-x-8 py-4">
          <Button
            size="sm"
            className="px-3 flex-1"
            variant="default"
            onClick={() => setDeleteModal(false)}
          >
            <span className="sr-only">Cancel</span>
            <span>Cancel</span>
          </Button>
          <Button
            type="submit"
            size="sm"
            className="px-3 flex-1"
            variant="destructive"
            onClick={() => DeleteFile()}
          >
            <span className="sr-only">Delete</span>
            <span>Delete</span>
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogDescription>
            This will permanently delete your file!
          </DialogDescription>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
