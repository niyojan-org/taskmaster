// DataCompleteness.jsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { IconCircleCheck, IconCreditCard, IconFileText, IconLink, IconPhoto, IconWorld } from "@tabler/icons-react";
const completenessItems = [
    { key: "organizationsWithDocuments", label: "Documents", icon: IconFileText, color: "#228be6" },
    { key: "organizationsWithBankDetails", label: "Bank Details", icon: IconCreditCard, color: "#40c057" },
    { key: "organizationsWithSocialLinks", label: "Social Links", icon: IconLink, color: "#845ef7" },
    { key: "organizationsWithLogo", label: "Logo", icon: IconPhoto, color: "#fd7e14" },
    { key: "organizationsWithWebsite", label: "Website", icon: IconWorld, color: "#4263eb" },
    { key: "organizationsWithVerificationRequests", label: "Verification Requests", icon: IconCircleCheck, color: "#fab005" },
];

export default function DataCompleteness({ data }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <IconFileText size={20} />
                    Organization Data Completeness
                </CardTitle>
                <CardDescription>Overview of completed organization profiles</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {completenessItems.map(({ key, label, icon: Icon, color }) => (
                        <div className="text-center" key={key}>
                            <Icon size={32} style={{ color }} className="mx-auto mb-2" />
                            <div className="text-2xl font-bold" style={{ color }}>{data[key]}</div>
                            <div className="text-sm text-muted-foreground">{label}</div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
