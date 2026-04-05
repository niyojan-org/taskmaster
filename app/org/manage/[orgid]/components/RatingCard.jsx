"use client";

import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { IconStars } from "@tabler/icons-react";
import CardFrame from "./CardFrame";

function RatingCard({ data, isSaving, onSave }) {
  const rating = data.rating || {};

  return (
    <CardFrame
      title="Rating"
      description="Trust and feedback posture"
      icon={IconStars}
      editable={false}
      isEditing={false}
      isSaving={isSaving}
      onEdit={() => {}}
      onCancel={() => {}}
      onSave={onSave}
    >
      <div className="grid gap-3">
        <div className="rounded-xl border border-border bg-muted p-3">
          <p className="text-xs text-muted-foreground">Average Rating</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">
            {Number(rating.averageRating || 0).toFixed(1)}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-muted p-3">
          <p className="text-xs text-muted-foreground">Total Ratings</p>
          <p className="mt-1 text-xl font-semibold text-foreground">
            {rating.totalRatings || 0}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <HoverCard>
            <HoverCardTrigger>
              <Badge variant="outline">
                Trust Score: {data.trustScore ?? 0}
              </Badge>
            </HoverCardTrigger>
            <HoverCardContent>
              <p className="text-sm text-foreground">
                Trust score reflects moderation history, profile completion, and
                compliance quality.
              </p>
            </HoverCardContent>
          </HoverCard>

          <HoverCard>
            <HoverCardTrigger>
              <Badge variant="outline">
                Risk Level: {data.riskLevel || "unknown"}
              </Badge>
            </HoverCardTrigger>
            <HoverCardContent>
              <p className="text-sm text-foreground">
                Risk level is derived from active warnings and flagged behavior
                indicators.
              </p>
            </HoverCardContent>
          </HoverCard>
        </div>
      </div>
    </CardFrame>
  );
}

export default RatingCard;
