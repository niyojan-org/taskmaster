"use client";

import { IconBuilding } from "@tabler/icons-react";
import CardFrame from "./CardFrame";
import FormFieldItem from "./FormFieldItem";

function BasicInfoCard({
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
      title="Basic Information"
      description="Primary organization identity and contact profile"
      icon={IconBuilding}
      isEditing={isEditing}
      isSaving={isSaving}
      onEdit={onEdit}
      onCancel={onCancel}
      onSave={onSave}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <FormFieldItem
          label="Organization Name"
          value={data.name}
          isEditing={isEditing}
          onChange={(e) => onFieldChange("name", e.target.value)}
        />

        <FormFieldItem
          label="Category"
          value={data.category}
          isEditing={isEditing}
          onChange={(e) => onFieldChange("category", e.target.value)}
        />

        <FormFieldItem
          label="Email"
          value={data.email}
          isEditing={isEditing}
          onChange={(e) => onFieldChange("email", e.target.value)}
        />

        <FormFieldItem
          label="Phone"
          value={data.phone}
          isEditing={isEditing}
          onChange={(e) => onFieldChange("phone", e.target.value)}
        />

        <FormFieldItem
          label="Website"
          value={data.website}
          className="md:col-span-2"
          displayClassName="truncate"
          isEditing={isEditing}
          onChange={(e) => onFieldChange("website", e.target.value)}
        />
      </div>
    </CardFrame>
  );
}

export default BasicInfoCard;
