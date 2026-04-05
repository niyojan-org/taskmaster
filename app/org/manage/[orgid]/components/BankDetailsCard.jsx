"use client";

import { Switch } from "@/components/ui/switch";
import { Field, FieldLabel } from "@/components/ui/field";
import { IconCreditCard } from "@tabler/icons-react";
import CardFrame from "./CardFrame";
import { maskAccountNumber } from "./cardUtils";
import FormFieldItem from "./FormFieldItem";

function BankDetailsCard({
  data,
  isEditing,
  isSaving,
  onEdit,
  onCancel,
  onSave,
  onFieldChange,
}) {
  const bank = data.bankDetails || {};

  return (
    <CardFrame
      title="Bank Details"
      description="Settlement account and verification state"
      icon={IconCreditCard}
      isEditing={isEditing}
      isSaving={isSaving}
      onEdit={onEdit}
      onCancel={onCancel}
      onSave={onSave}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <FormFieldItem
          label="Account Holder Name"
          value={bank.accountHolderName}
          className="md:col-span-2"
          isEditing={isEditing}
          onChange={(e) =>
            onFieldChange("bankDetails.accountHolderName", e.target.value)
          }
        />

        <FormFieldItem
          label="Bank Name"
          value={bank.bankName}
          isEditing={isEditing}
          onChange={(e) =>
            onFieldChange("bankDetails.bankName", e.target.value)
          }
        />

        <FormFieldItem
          label="Branch Name"
          value={bank.branchName}
          isEditing={isEditing}
          onChange={(e) =>
            onFieldChange("bankDetails.branchName", e.target.value)
          }
        />

        <FormFieldItem
          label="Account Number"
          value={
            isEditing
              ? bank.accountNumber
              : maskAccountNumber(bank.accountNumber)
          }
          isEditing={isEditing}
          onChange={(e) =>
            onFieldChange("bankDetails.accountNumber", e.target.value)
          }
        />

        <FormFieldItem
          label="IFSC Code"
          value={bank.ifscCode}
          isEditing={isEditing}
          onChange={(e) =>
            onFieldChange("bankDetails.ifscCode", e.target.value)
          }
        />

        <FormFieldItem
          label="UPI ID"
          value={bank.upiId}
          className="md:col-span-2"
          isEditing={isEditing}
          onChange={(e) => onFieldChange("bankDetails.upiId", e.target.value)}
        />

        <div className="md:col-span-2 grid gap-3 sm:grid-cols-2">
          <Field
            orientation="horizontal"
            className="items-center justify-between rounded-xl border border-border bg-muted px-3 py-2"
          >
            <FieldLabel>Bank Verified</FieldLabel>
            <Switch
              checked={!!bank.verified}
              disabled={!isEditing}
              onCheckedChange={(value) =>
                onFieldChange("bankDetails.verified", value)
              }
            />
          </Field>
          <Field
            orientation="horizontal"
            className="items-center justify-between rounded-xl border border-border bg-muted px-3 py-2"
          >
            <FieldLabel>Requested Verification</FieldLabel>
            <Switch
              checked={!!bank.reqForVerification}
              disabled={!isEditing}
              onCheckedChange={(value) =>
                onFieldChange("bankDetails.reqForVerification", value)
              }
            />
          </Field>
        </div>
      </div>
    </CardFrame>
  );
}

export default BankDetailsCard;
