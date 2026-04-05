"use client";

import { IconChartBar } from "@tabler/icons-react";
import CardFrame from "./CardFrame";
import { formatNumber } from "./cardUtils";

function StatItem({ label, value }) {
  return (
    <div className="rounded-xl border border-border bg-muted p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-semibold text-foreground">
        {formatNumber(value)}
      </p>
    </div>
  );
}

function StatsCard({ data, isSaving, onSave }) {
  const stats = data.stats || {};

  return (
    <CardFrame
      title="Stats"
      description="Read-only activity and behavior metrics"
      icon={IconChartBar}
      editable={false}
      isEditing={false}
      isSaving={isSaving}
      onEdit={() => {}}
      onCancel={() => {}}
      onSave={onSave}
      className="h-full"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <StatItem label="Events Hosted" value={stats.totalEventsHosted} />
        <StatItem label="Tickets Sold" value={stats.totalTicketsSold} />
        <StatItem label="Blocked Events" value={stats.totalBlockedEvents} />
        <StatItem label="Warnings" value={stats.totalWarnings} />
      </div>
    </CardFrame>
  );
}

export default StatsCard;
