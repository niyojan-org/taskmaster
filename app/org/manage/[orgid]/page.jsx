"use client";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import useOrganizationStore from "./orgStore";
import DashboardSkeleton from "./components/DashboardSkeleton";
import BasicInfoCard from "./components/BasicInfoCard";
import AddressCard from "./components/AddressCard";
import StatusCard from "./components/StatusCard";
import VerificationCard from "./components/VerificationCard";
import EventPermissionsCard from "./components/EventPermissionsCard";
import EventPreferencesCard from "./components/EventPreferencesCard";
import StatsCard from "./components/StatsCard";
import RatingCard from "./components/RatingCard";
import DocumentsCard from "./components/DocumentsCard";
import BankDetailsCard from "./components/BankDetailsCard";
import RiskFlagsCard from "./components/RiskFlagsCard";
import OnboardingProgressCard from "./components/OnboardingProgressCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  IconSparkles,
  IconBuildingSkyscraper,
  IconShieldCheck,
} from "@tabler/icons-react";

const cardIds = {
  basicInfo: "basicInfo",
  address: "address",
  status: "status",
  permissions: "permissions",
  preferences: "preferences",
  bankDetails: "bankDetails",
  onboarding: "onboarding",
};

function Page() {
  const { orgid } = useParams();
  const {
    organizationId,
    organizationData,
    loading,
    saving,
    editingStates,
    activeEditCard,
    setOrganizationId,
    updateOrganizationField,
    toggleEdit,
    cancelEdit,
    saveOrganizationData,
    verifyOrganization,
    rejectVerificationRequest,
    unverifyOrganization,
  } = useOrganizationStore();

  useEffect(() => {
    if (orgid && orgid !== organizationId) {
      setOrganizationId(orgid);
    }
  }, [orgid, organizationId, setOrganizationId]);

  const handleEdit = (cardId) => {
    if (activeEditCard && activeEditCard !== cardId) {
      toast.error("Finish or cancel the current edit before switching cards.");
      return;
    }
    toggleEdit(cardId);
  };

  const handleSave = async (cardId) => {
    try {
      await saveOrganizationData(cardId);
      toast.success("Organization profile updated.");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Unable to save organization profile.",
      );
    }
  };

  const handleVerifyOrganization = async ({ allowsEventCreation, note }) => {
    try {
      await verifyOrganization({ allowsEventCreation, note });
      toast.success("Organization verified successfully.");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Unable to verify organization.",
      );
      throw error;
    }
  };

  const handleRejectVerification = async ({ reason }) => {
    try {
      await rejectVerificationRequest({ reason });
      toast.success("Verification request rejected.");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Unable to reject verification request.",
      );
      throw error;
    }
  };

  const handleUnverifyOrganization = async ({ reason }) => {
    try {
      await unverifyOrganization({ reason });
      toast.success("Organization unverified.");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Unable to unverify organization.",
      );
      throw error;
    }
  };

  const handleToggleEventCreation = async ({ allowsEventCreation }) => {
    const previousValue = organizationData.allowsEventCreation ?? true;

    try {
      updateOrganizationField("allowsEventCreation", allowsEventCreation);
      await saveOrganizationData("verification");
      toast.success(
        allowsEventCreation
          ? "Event creation has been enabled."
          : "Event creation has been disabled.",
      );
    } catch (error) {
      updateOrganizationField("allowsEventCreation", previousValue);
      toast.error(
        error?.response?.data?.message ||
          "Unable to update event creation access.",
      );
      throw error;
    }
  };

  if (loading || !organizationData) {
    return (
      <div className="min-h-screen bg-background px-4 py-6 text-foreground md:px-6 lg:px-8">
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-6 text-foreground md:px-6 lg:px-8">
      <Card className="mb-6 overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="rounded-xl border border-border bg-muted p-2">
                <IconBuildingSkyscraper className="size-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Organization Admin
                </p>
                <h1 className="text-2xl font-semibold text-foreground">
                  {organizationData.name || "Organization"}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline">
                <IconSparkles className="size-3.5" />
                Profile Workspace
              </Badge>
              <Badge variant="outline">
                <IconShieldCheck className="size-3.5" />
                Secure Admin View
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground">
            Manage profile, compliance, permissions, and onboarding in a single
            structured workspace.
          </p>
          <Separator className="my-4" />
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={organizationData.active ? "default" : "outline"}>
              {organizationData.active ? "Active" : "Inactive"}
            </Badge>
            <Badge variant={organizationData.verified ? "default" : "outline"}>
              {organizationData.verified ? "Verified" : "Unverified"}
            </Badge>
            <Badge variant="outline">ID: {organizationData._id}</Badge>
            <Badge variant="outline">
              Trust Score: {organizationData.trustScore ?? 0}
            </Badge>
            <Badge variant="outline">
              Risk: {organizationData.riskLevel || "unknown"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:auto-rows-fr xl:grid-cols-12">
        <div className="h-full md:col-span-2 xl:col-span-8">
          <BasicInfoCard
            data={organizationData}
            isEditing={!!editingStates[cardIds.basicInfo]}
            isSaving={saving}
            onEdit={() => handleEdit(cardIds.basicInfo)}
            onCancel={() => cancelEdit(cardIds.basicInfo)}
            onSave={() => handleSave(cardIds.basicInfo)}
            onFieldChange={updateOrganizationField}
          />
        </div>

        <div className="h-full xl:col-span-4">
          <StatusCard
            data={organizationData}
            isEditing={!!editingStates[cardIds.status]}
            isSaving={saving}
            onEdit={() => handleEdit(cardIds.status)}
            onCancel={() => cancelEdit(cardIds.status)}
            onSave={() => handleSave(cardIds.status)}
            onFieldChange={updateOrganizationField}
          />
        </div>

        <div className="h-full md:col-span-2 xl:col-span-4">
          <VerificationCard
            data={organizationData}
            isSaving={saving}
            onVerifyOrganization={handleVerifyOrganization}
            onRejectVerification={handleRejectVerification}
            onUnverifyOrganization={handleUnverifyOrganization}
            onToggleEventCreation={handleToggleEventCreation}
          />
        </div>

        <div className="h-full md:col-span-2 xl:col-span-4">
          <StatsCard
            data={organizationData}
            isSaving={saving}
            onSave={() => handleSave("stats")}
          />
        </div>
        <div className="h-full md:col-span-2 xl:col-span-4">
          <RatingCard
            data={organizationData}
            isSaving={saving}
            onSave={() => handleSave("rating")}
          />
        </div>

        <div className="h-full md:col-span-2 xl:col-span-6 xl:row-span-1">
          <DocumentsCard
            data={organizationData}
            isSaving={saving}
            onSave={() => handleSave("documents")}
          />
        </div>

        <div className="h-full md:col-span-2 xl:col-span-6">
          <AddressCard
            data={organizationData}
            isEditing={!!editingStates[cardIds.address]}
            isSaving={saving}
            onEdit={() => handleEdit(cardIds.address)}
            onCancel={() => cancelEdit(cardIds.address)}
            onSave={() => handleSave(cardIds.address)}
            onFieldChange={updateOrganizationField}
          />
        </div>

        <div className="h-full md:col-span-2 xl:col-span-8">
          <BankDetailsCard
            data={organizationData}
            isEditing={!!editingStates[cardIds.bankDetails]}
            isSaving={saving}
            onEdit={() => handleEdit(cardIds.bankDetails)}
            onCancel={() => cancelEdit(cardIds.bankDetails)}
            onSave={() => handleSave(cardIds.bankDetails)}
            onFieldChange={updateOrganizationField}
          />
        </div>

        <div className="h-full xl:col-span-4">
          <EventPermissionsCard
            data={organizationData}
            isEditing={!!editingStates[cardIds.permissions]}
            isSaving={saving}
            onEdit={() => handleEdit(cardIds.permissions)}
            onCancel={() => cancelEdit(cardIds.permissions)}
            onSave={() => handleSave(cardIds.permissions)}
            onFieldChange={updateOrganizationField}
          />
        </div>

        <div className="h-full md:col-span-2 xl:col-span-6">
          <EventPreferencesCard
            data={organizationData}
            isEditing={!!editingStates[cardIds.preferences]}
            isSaving={saving}
            onEdit={() => handleEdit(cardIds.preferences)}
            onCancel={() => cancelEdit(cardIds.preferences)}
            onSave={() => handleSave(cardIds.preferences)}
            onFieldChange={updateOrganizationField}
          />
        </div>

        <div className="h-full md:col-span-2 xl:col-span-6">
          <RiskFlagsCard
            data={organizationData}
            isSaving={saving}
            onSave={() => handleSave("risk")}
          />
        </div>
      </div>
    </div>
  );
}

export default Page;
