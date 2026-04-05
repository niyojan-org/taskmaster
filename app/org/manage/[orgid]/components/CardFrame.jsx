"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IconEdit, IconX, IconDeviceFloppy } from "@tabler/icons-react";

function CardFrame({
  title,
  description,
  icon: Icon,
  editable = true,
  isEditing,
  isSaving,
  onEdit,
  onCancel,
  onSave,
  children,
  className = "",
}) {
  return (
    <Card className={`group relative h-full w-full ${className}`}>
      <CardHeader className="border-border pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="rounded-xl border border-border bg-muted p-2 transition-colors">
              <Icon className="size-5 text-muted-foreground" />
            </div>
            <div>
              <CardTitle>{title}</CardTitle>
              {description ? (
                <CardDescription>{description}</CardDescription>
              ) : null}
            </div>
          </div>

          {editable ? (
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onCancel}
                    disabled={isSaving}
                  >
                    <IconX />
                    Cancel
                  </Button>
                  <Button size="sm" onClick={onSave} disabled={isSaving}>
                    <IconDeviceFloppy />
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="sm" onClick={onEdit}>
                  <IconEdit />
                  Edit
                </Button>
              )}
            </div>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="flex-1 pt-0">{children}</CardContent>
    </Card>
  );
}

export default CardFrame;
