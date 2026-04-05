"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { Progress } from "@/components/ui/progress";
import { IconChecklist } from "@tabler/icons-react";
import CardFrame from "./CardFrame";
import { completionPercent } from "./cardUtils";

function OnboardingProgressCard({
  data,
  isEditing,
  isSaving,
  onEdit,
  onCancel,
  onSave,
  onFieldChange,
}) {
  const steps = data.stepsCompleted || {};
  const percent = completionPercent(steps);
  const items = Object.entries(steps);

  return (
    <CardFrame
      title="Onboarding Progress"
      description="Checklist completion across setup steps"
      icon={IconChecklist}
      isEditing={isEditing}
      isSaving={isSaving}
      onEdit={onEdit}
      onCancel={onCancel}
      onSave={onSave}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <p className="text-muted-foreground">Completion</p>
            <p className="font-medium text-foreground">{percent}%</p>
          </div>
          <Progress value={percent} className="w-full" />
        </div>

        <div className="space-y-2">
          {items.map(([key, done]) => (
            <Field
              key={key}
              orientation="horizontal"
              className="flex items-center gap-3 rounded-xl border border-border bg-muted px-3 py-2"
            >
              <Checkbox
                checked={!!done}
                disabled={!isEditing}
                onCheckedChange={(value) =>
                  onFieldChange(`stepsCompleted.${key}`, Boolean(value))
                }
              />
              <FieldLabel>{key}</FieldLabel>
            </Field>
          ))}
        </div>
      </div>
    </CardFrame>
  );
}

export default OnboardingProgressCard;
