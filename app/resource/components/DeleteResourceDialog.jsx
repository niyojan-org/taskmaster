"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IconTrash } from "@tabler/icons-react";

export default function DeleteResourceDialog({
  open,
  onOpenChange,
  resource,
  onConfirm,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Resource</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this resource? This action will
            soft-delete the resource and it can be restored later.
          </DialogDescription>
        </DialogHeader>
        {resource && (
          <div className="bg-muted p-4 rounded-lg">
            <p className="font-medium">{resource.name}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {resource.description || "No description"}
            </p>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            <IconTrash className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
