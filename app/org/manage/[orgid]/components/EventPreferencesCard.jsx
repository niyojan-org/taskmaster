"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { IconAdjustments } from "@tabler/icons-react";
import CardFrame from "./CardFrame";

const EVENT_TYPE_OPTIONS = [
  "workshop",
  "networking",
  "competition",
  "exhibition",
  "conference",
  "webinar",
  "festival",
  "summit",
];

function EventPreferencesCard({
  data,
  isEditing,
  isSaving,
  onEdit,
  onCancel,
  onSave,
  onFieldChange,
}) {
  const preferences = data.eventPreferences || {};
  const selectedTypes = preferences.preferredEventTypes || [];

  const toggleType = (type) => {
    if (!isEditing) {
      return;
    }

    const exists = selectedTypes.includes(type);
    const nextTypes = exists
      ? selectedTypes.filter((item) => item !== type)
      : [...selectedTypes, type];

    onFieldChange("eventPreferences.preferredEventTypes", nextTypes);
  };

  return (
    <CardFrame
      title="Event Preferences"
      description="Operational defaults for hosted events"
      icon={IconAdjustments}
      isEditing={isEditing}
      isSaving={isSaving}
      onEdit={onEdit}
      onCancel={onCancel}
      onSave={onSave}
    >
      <div className="space-y-4">
        <Field>
          <FieldLabel>Max Events Per Month</FieldLabel>
          <FieldContent>
            <Input
              type="number"
              value={preferences.maxEventsPerMonth ?? 0}
              disabled={!isEditing}
              onChange={(e) =>
                onFieldChange(
                  "eventPreferences.maxEventsPerMonth",
                  Number(e.target.value || 0),
                )
              }
            />
          </FieldContent>
        </Field>

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Preferred Event Types</p>
          <div className="flex flex-wrap gap-2">
            {EVENT_TYPE_OPTIONS.map((type) => {
              const active = selectedTypes.includes(type);
              return (
                <Button
                  key={type}
                  type="button"
                  variant={active ? "default" : "outline"}
                  size="sm"
                  disabled={!isEditing}
                  onClick={() => toggleType(type)}
                >
                  {type}
                </Button>
              );
            })}
          </div>
        </div>

        <Field
          orientation="horizontal"
          className="items-center justify-between rounded-xl border border-border bg-muted px-3 py-2"
        >
          <FieldLabel>Auto Approve Events</FieldLabel>
          <Switch
            checked={!!preferences.autoApproveEvents}
            disabled={!isEditing}
            onCheckedChange={(value) =>
              onFieldChange("eventPreferences.autoApproveEvents", value)
            }
          />
        </Field>
      </div>
    </CardFrame>
  );
}

export default EventPreferencesCard;
