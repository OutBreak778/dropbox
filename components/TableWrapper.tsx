"use client";

import { FileTypes } from "@/typings";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { DataTable } from "./Table";
import { columns } from "./Columns";
import { useUser } from "@clerk/nextjs";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase";
import { Skeleton } from "./ui/skeleton";
import { useRouter } from "next/navigation";

const TableWrapper = ({ skeleton }: { skeleton: FileTypes[] }) => {

  const router = useRouter()

  const { user } = useUser();
  const [initialFiles, setInitialFiles] = useState<FileTypes[]>([]);
  const [sort, setSort] = useState<"asc" | "desc">("desc")

  const [docs, loading, error] = useCollection(
    user &&
      query(
        collection(db, "users", user.id, "files"),
        orderBy("timestamp", sort)
        )
  );

  useEffect(() => {
    if (!docs) return;
    const files: FileTypes[] = docs.docs.map((doc) => ({
      id: doc.id,
      filename: doc.data().filename || doc.id,
      timestamp: new Date(doc.data().timestamp?.seconds * 1000) || undefined,
      fullName: doc.data().fullName,
      downloadURL: doc.data().downloadURL,
      type: doc.data().type,
      size: doc.data().size,
    }));
    setInitialFiles(files);
    router.refresh()
  }, [docs]);

  if (docs?.docs.length === undefined) 
    return (
      <div className="flex flex-col">
        <Button variant="outline" className="ml-auto w-36 h-10 mb-5">
          <Skeleton className="h-5 w-full" />
        </Button>
        <div className="border rounded-lg">
          <div className="border-b h-12" />
          {
            skeleton.map((file) => (
              <div className="flex items-center space-x-4 p-5 w-full" key={file.id}>
                  <Skeleton className="h-12 w-12" />
                  <Skeleton className="h-12 w-full" />
                </div>
            ))
          }
          {
            skeleton.length === 0 && (
              <div className="flex items-center space-x-4 p-5 w-full">
                  <Skeleton className="h-12 w-12" />
                  <Skeleton className="h-12 w-full" />
                </div>
            )
          }
        </div>
      </div>
    );
  

  return (
    <div className="flex flex-col space-y-5 pb-10">
      <Button
        onClick={() => setSort(sort === "desc" ? "asc" : "desc")}
        variant="outline"
        className="ml-auto w-fit"
      >
        Sort by {sort === "desc" ? "Newest" : "Oldest"}
      </Button>
      <DataTable columns={columns} data={skeleton} />
    </div>
  );
};

export default TableWrapper;
