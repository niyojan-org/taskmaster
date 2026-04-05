"use client";

import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Field, FieldLabel } from "@/components/ui/field";
import { IconShieldCheck } from "@tabler/icons-react";
import CardFrame from "./CardFrame";

function StatusCard({
  data,
  isEditing,
  isSaving,
  onEdit,
  onCancel,
  onSave,
  onFieldChange,
}) {
  const riskLevel = (data.riskLevel || "unknown").toUpperCase();

  return (
    <CardFrame
      title="Status"
      description="Operational and trust controls"
      icon={IconShieldCheck}
      isEditing={isEditing}
      isSaving={isSaving}
      onEdit={onEdit}
      onCancel={onCancel}
      onSave={onSave}
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={data.active ? "default" : "outline"}>
            {data.active ? "Active" : "Inactive"}
          </Badge>
          <Badge variant={data.isBlocked ? "default" : "outline"}>
            {data.isBlocked ? "Blocked" : "Clear"}
          </Badge>
          <Badge variant="outline">Risk: {riskLevel}</Badge>
        </div>

        <div className="grid gap-3">
          <Field
            orientation="horizontal"
            className="items-center justify-between rounded-xl border border-border bg-muted px-3 py-2"
          >
            <FieldLabel>Active Organization</FieldLabel>
            <Switch
              checked={!!data.active}
              disabled={!isEditing}
              onCheckedChange={(value) => onFieldChange("active", value)}
            />
          </Field>

          <Field
            orientation="horizontal"
            className="items-center justify-between rounded-xl border border-border bg-muted px-3 py-2"
          >
            <FieldLabel>Verified Profile</FieldLabel>
            <Switch
              checked={!!data.verified}
              disabled={!isEditing}
              onCheckedChange={(value) => onFieldChange("verified", value)}
            />
          </Field>

          <Field
            orientation="horizontal"
            className="items-center justify-between rounded-xl border border-border bg-muted px-3 py-2"
          >
            <FieldLabel>Blocked</FieldLabel>
            <Switch
              checked={!!data.isBlocked}
              disabled={!isEditing}
              onCheckedChange={(value) => onFieldChange("isBlocked", value)}
            />
          </Field>
        </div>
      </div>
    </CardFrame>
  );
}

export default StatusCard;
