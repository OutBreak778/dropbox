"use client";

import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import DropZoneComponent from "react-dropzone";
import { db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { toast } from "./ui/use-toast";

const Dropzone = () => {

    const [loading, setLoading] = useState(false)
    const {user, isLoaded, isSignedIn} = useUser()

    const onDrop = (acceptedFiles: File[]) => {
        acceptedFiles.forEach((file) => {
            const reader = new FileReader()

            reader.onabort = () => console.log("Error readed has aborting")
            reader.onerror = () => console.log("Error readed has failed")
        
            reader.onload = async () => {
                try {
                  await uploadPost(file)
                  toast({
                    description :"File uploaded",
                    variant: "default"
                  })
                } catch (error) {
                  console.log(error)
                }
            }
            reader.readAsArrayBuffer(file)
        });
    }

    const uploadPost = async (selectedFile: File) => {
        if(loading) return
        if(!user) return

        setLoading(true)

        toast({
          description: "File Uploading...",
          variant: "default"
        })

        const docs = await addDoc(collection(db,"users",user.id, "files"),{
            userId: user.id,
            filename: selectedFile.name,
            fullName: user.fullName,
            profileImg: user.imageUrl,
            timestamp: serverTimestamp(),
            type: selectedFile.type,
            size: selectedFile.size
        })

        const imageRef = ref(storage,`users/${user.id}/files/${docs.id}`)
        uploadBytes(imageRef, selectedFile).then(async(snapshot) => {
            const downloadURl = await getDownloadURL(imageRef);

            await updateDoc(doc(db, "users", user.id, "files", docs.id), {
                downloadURL: downloadURl
            })
        })

        setLoading(false)

    }

  const maxSize = 100000000;

  return (
    <DropZoneComponent
      minSize={0}
      maxSize={maxSize}
      onDrop={onDrop}
    >
      {({
        getRootProps,
        getInputProps,
        isDragActive,
        isDragReject,
        fileRejections,
      }) => {
        const isFileTooLarge =
          fileRejections.length > 0 && fileRejections[0].file.size > maxSize;
        return (
          <section className="m-4">
            <div {...getRootProps()} className={cn("w-full h-52 flex justify-center cursor-pointer items-center p-5 border-2 border-dashed rounded-lg text-center", isDragActive ? "bg-[#035ffe] text-white animate-pulse" : "bg-slate-100/50 dark:bg-slate-800/80 text-slate-400")}>
              <input {...getInputProps()} />
              {!isDragActive && <p>Click here to drop a file!</p>}
              {isDragActive && !isDragReject && (
                <p>Drop to upload this file!</p>
              )}
              {isDragReject && <p>File type not Accepted, Sorry!</p>}
              {isFileTooLarge && (
                <p className="text-danger mt-4">File is too Large</p>
              )}
            </div>
          </section>
        );
      }}
    </DropZoneComponent>
  );
};

export default Dropzone;
