"use client";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { IconCalendarEvent } from "@tabler/icons-react";
import CardFrame from "./CardFrame";

function EventPermissionsCard({
  data,
  isEditing,
  isSaving,
  onEdit,
  onCancel,
  onSave,
  onFieldChange,
}) {
  return (
    <CardFrame
      title="Event Permissions"
      description="Platform-level event creation controls"
      icon={IconCalendarEvent}
      isEditing={isEditing}
      isSaving={isSaving}
      onEdit={onEdit}
      onCancel={onCancel}
      onSave={onSave}
    >
      <div className="space-y-3">
        <Field
          orientation="horizontal"
          className="items-center justify-between rounded-xl border border-border bg-muted px-3 py-2"
        >
          <FieldLabel>Can Create Events</FieldLabel>
          <Switch
            checked={!!data.canCreateEvents}
            disabled={!isEditing}
            onCheckedChange={(value) => onFieldChange("canCreateEvents", value)}
          />
        </Field>

        <Field
          orientation="horizontal"
          className="items-center justify-between rounded-xl border border-border bg-muted px-3 py-2"
        >
          <FieldLabel>Event Creation Blocked</FieldLabel>
          <Switch
            checked={!!data.eventCreationBlocked}
            disabled={!isEditing}
            onCheckedChange={(value) =>
              onFieldChange("eventCreationBlocked", value)
            }
          />
        </Field>

        <Field
          orientation="horizontal"
          className="items-center justify-between rounded-xl border border-border bg-muted px-3 py-2"
        >
          <FieldLabel>Allows Paid Events</FieldLabel>
          <Switch
            checked={!!data.eventPreferences?.allowsPaidEvents}
            disabled={!isEditing}
            onCheckedChange={(value) =>
              onFieldChange("eventPreferences.allowsPaidEvents", value)
            }
          />
        </Field>

        <Field>
          <FieldLabel>Max Events Allowed (Optional)</FieldLabel>
          <FieldContent>
            <Input
              type="number"
              value={data.maxEventsAllowed ?? ""}
              disabled={!isEditing}
              onChange={(e) => {
                const value = e.target.value;
                onFieldChange(
                  "maxEventsAllowed",
                  value === "" ? null : Number(value),
                );
              }}
            />
          </FieldContent>
        </Field>
      </div>
    </CardFrame>
  );
}

export default EventPermissionsCard;
