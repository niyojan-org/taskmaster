"use client";

import { Badge } from "@/components/ui/badge";
import { IconAlertTriangle } from "@tabler/icons-react";
import CardFrame from "./CardFrame";

function RiskFlagsCard({ data, isSaving, onSave }) {
  const fraudFlags = data.fraudFlags || [];
  const warnings = data.warnings || [];
  const hasFlags = fraudFlags.length > 0 || warnings.length > 0;

  return (
    <CardFrame
      title="Risk Flags"
      description="Fraud and warning signal monitor"
      icon={IconAlertTriangle}
      editable={false}
      isEditing={false}
      isSaving={isSaving}
      onEdit={() => {}}
      onCancel={() => {}}
      onSave={onSave}
    >
      {hasFlags ? (
        <div className="space-y-3">
          {fraudFlags.length > 0 ? (
            <div className="space-y-2 rounded-xl border border-border bg-muted p-3">
              <p className="text-xs text-muted-foreground">Fraud Flags</p>
              <div className="flex flex-wrap gap-2">
                {fraudFlags.map((flag, index) => (
                  <Badge key={`${flag}-${index}`} variant="default">
                    {flag}
                  </Badge>
                ))}
              </div>
            </div>
          ) : null}

          {warnings.length > 0 ? (
            <div className="space-y-2 rounded-xl border border-border bg-muted p-3">
              <p className="text-xs text-muted-foreground">Warnings</p>
              <div className="flex flex-wrap gap-2">
                {warnings.map((warning, index) => (
                  <Badge key={`${warning}-${index}`} variant="outline">
                    {warning}
                  </Badge>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-muted p-4 text-sm text-muted-foreground">
          No active risk flags detected.
        </div>
      )}
    </CardFrame>
  );
}

export default RiskFlagsCard;
