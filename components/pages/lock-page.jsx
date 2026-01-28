
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import useAuthStore from "@/store/authStore";

export default function LockPage() {
    const checkAuth = useAuthStore((state) => state.checkAuth);

    // Opens a popup for login and checks auth after successful login
    const handleLogin = () => {
        const popup = window.open(
            "https://iamabhi.me/auth",
            "LoginPopup",
            "width=500,height=700"
        );
        if (!popup) return;

        // Poll for cookie/session setup
        const pollInterval = setInterval(() => {
            try {
                // You can check for a specific cookie or just try checkAuth
                // If popup is closed, stop polling
                if (popup.closed) {
                    clearInterval(pollInterval);
                    checkAuth();
                }
            } catch (e) {
                // Ignore cross-origin errors
            }
        }, 1000);
    };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
            <div className="w-full max-w-md px-4">
                <Card className="border-2">
                    <CardHeader className="text-center space-y-4">
                        <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                            <Lock className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl">Access Restricted</CardTitle>
                            <CardDescription className="mt-2">
                                Please login first to access this site
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="text-center">
                        <Button className="w-full" size="lg" onClick={handleLogin}>
                            Login to Continue
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}