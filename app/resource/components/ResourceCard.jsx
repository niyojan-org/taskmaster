"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  IconEdit,
  IconTrash,
  IconDownload,
  IconExternalLink,
  IconEye,
  IconEyeOff,
} from "@tabler/icons-react";

export default function ResourceCard({ resource, isAdmin, onEdit, onDelete }) {
  const [imageError, setImageError] = useState(false);

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50">
      <CardHeader className="pb-3 space-y-2">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg line-clamp-1 group-hover:text-primary transition-colors">
              {resource.title}
            </CardTitle>
            <CardDescription className="line-clamp-2 mt-1.5">
              {resource.description || "No description provided"}
            </CardDescription>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Badge variant={resource.active ? "default" : "secondary"} className="text-xs">
              {resource.active ? (
                <>
                  <IconEye className="h-3 w-3 mr-1" />
                  Active
                </>
              ) : (
                <>
                  <IconEyeOff className="h-3 w-3 mr-1" />
                  Inactive
                </>
              )}
            </Badge>
          </div>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <Badge variant="outline" className="text-xs font-medium">
            {resource.type}
          </Badge>
          {resource.priority && (
            <Badge variant="secondary" className="text-xs">
              Priority: {resource.priority}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Preview */}
        <div className="relative bg-gradient-to-br from-muted to-muted/50 rounded-lg overflow-hidden h-48 group/image">
          {!imageError ? (
            <img
              src={resource.url}
              alt={resource.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover/image:scale-105"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <IconExternalLink className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Preview unavailable</p>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity" />
        </div>

        {/* Tags */}
        {resource.tags && resource.tags.length > 0 && (
          <div className="flex gap-1.5 flex-wrap">
            {resource.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
            {resource.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{resource.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Metadata */}
        <div className="space-y-1.5 text-xs text-muted-foreground">
          {resource.link && (
            <div className="flex items-center gap-2">
              <IconExternalLink className="h-3 w-3" />
              <a
                href={resource.link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary truncate"
              >
                {resource.link}
              </a>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span>Created:</span>
            <span className="font-medium">
              {new Date(resource.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="default"
            size="sm"
            className="flex-1"
            onClick={() => window.open(resource.url, "_blank")}
          >
            <IconDownload className="h-3.5 w-3.5 mr-1.5" />
            View
          </Button>
          {isAdmin && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(resource)}
              >
                <IconEdit className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => onDelete(resource)}
              >
                <IconTrash className="h-3.5 w-3.5" />
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
