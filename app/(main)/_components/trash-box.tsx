"use client"

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Spinner } from "@/components/spinner";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { Search, Trash, Undo } from "lucide-react";
import { useParams, useRouter } from "next/navigation"
import React, { useState } from "react"
import { toast } from "sonner";

export const TrashBox = () => {
  const router = useRouter();
  const params = useParams();
  const documents = useQuery(api.documents.getTrash);
  const restore = useMutation(api.documents.restore);
  const remove = useMutation(api.documents.remove);

  const [search, setSearch] = useState("");

  const filteredDocuments = documents?.filter((document) => {
    return document.title.toLowerCase().includes(search.toLowerCase());
  });

  const onClick = (documentsId: string) => {
    router.push(`/documents/${documentsId}`)
  };

  const onRestore = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    documentsId: Id<"documents">
  ) => {
    event.stopPropagation();
    const promise = restore({ id: documentsId})

    toast.promise(promise, {
      loading: "Restoring note...",
      success: "Note restored successfully",
      error: "Error restoring note",
    });
  };

  const onRemove = (
    documentsId: Id<"documents">
  ) => {
    const promise = remove({ id: documentsId})

    toast.promise(promise, {
      loading: "Deleting note...",
      success: "Note Deleted successfully",
      error: "Error Deleting note",
    });

    if (params.documentId === documentsId) {
      router.push("/documents");
    }
  };

  if(documents === undefined){
    return(
      <div className="h-[100vh] flex items-center justify-center p-4">
        <Spinner size="lg"/>
      </div>
    )
  }

  return(
    <div className="text-sm">
      <div className="flex items-center gap-x-1 p-2">
        <Search className="h-4 w-4"/>
        <Input
          type="search"
          onChange={(e) => setSearch(e.target.value)}
          className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
          placeholder="Filter by page title..."
        />
      </div>
      <div className="mt-2 px-1 pb-1">
        <p className="hidden last:block text-xs text-center text-muted-foreground pb-2">
          No documents found
        </p>
        {filteredDocuments?.map((document) => (
          <div
            key={document._id}
            role="button"
            onClick={() => onClick(document._id)}
            className="text-sm rounded-sm w-full hover:bg-primary/5 flex items-center text-pretty justify-between"
          >
            <span className="truncate pl-2">
              {document.title}
            </span>
            <div className="flex items-center">
              <div
                onClick={(e) => onRestore(e, document._id)}
                role="button"
                className="rounded-sm p-2 hover:bg-neutral-200"
              >
                <Undo className="h-4 w-4 text-muted-foreground"/>
              </div>
              <ConfirmModal onConfirm={() => onRemove(document._id)}>
                <div 
                  // onClick={(e) => onDelete(e, document._id)}
                  role="button"
                  className="rounded-sm p-2 hover:bg-neutral-200"
                >
                  <Trash className="h-4 w-4 text-muted-foreground"/>
                </div>
              </ConfirmModal>
              
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
