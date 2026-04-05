"use client";

import { Input } from "@/components/ui/input";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { toDisplayValue } from "./cardUtils";

function FormFieldItem({
  label,
  value,
  isEditing,
  onChange,
  type = "text",
  className = "",
  displayClassName = "",
}) {
  return (
    <Field className={className}>
      <FieldLabel>{label}</FieldLabel>
      <FieldContent>
        {isEditing ? (
          <Input type={type} value={value ?? ""} onChange={onChange} />
        ) : (
          <p className={displayClassName}>{toDisplayValue(value)}</p>
        )}
      </FieldContent>
    </Field>
  );
}

export default FormFieldItem;
