"use client";

import { IconMapPin } from "@tabler/icons-react";
import CardFrame from "./CardFrame";
import FormFieldItem from "./FormFieldItem";

function AddressCard({
  data,
  isEditing,
  isSaving,
  onEdit,
  onCancel,
  onSave,
  onFieldChange,
}) {
  const address = data.address || {};

  return (
    <CardFrame
      title="Address"
      description="Location and region settings"
      icon={IconMapPin}
      isEditing={isEditing}
      isSaving={isSaving}
      onEdit={onEdit}
      onCancel={onCancel}
      onSave={onSave}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <FormFieldItem
          label="Street"
          value={address.street}
          className="md:col-span-2"
          isEditing={isEditing}
          onChange={(e) => onFieldChange("address.street", e.target.value)}
        />

        <FormFieldItem
          label="City"
          value={address.city}
          isEditing={isEditing}
          onChange={(e) => onFieldChange("address.city", e.target.value)}
        />

        <FormFieldItem
          label="State"
          value={address.state}
          isEditing={isEditing}
          onChange={(e) => onFieldChange("address.state", e.target.value)}
        />

        <FormFieldItem
          label="Country"
          value={address.country}
          isEditing={isEditing}
          onChange={(e) => onFieldChange("address.country", e.target.value)}
        />

        <FormFieldItem
          label="Zip Code"
          value={address.zipCode}
          isEditing={isEditing}
          onChange={(e) => onFieldChange("address.zipCode", e.target.value)}
        />
      </div>
    </CardFrame>
  );
}

export default AddressCard;
