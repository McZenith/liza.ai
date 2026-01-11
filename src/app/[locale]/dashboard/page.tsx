import { getTranslations } from "next-intl/server";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
    // TODO: Uncomment when OAuth is ready
    // const session = await auth();
    // if (!session?.user) {
    //   redirect("/login");
    // }

    const t = await getTranslations("dashboard");

    // Mock user for development
    const mockUser = {
        name: "Demo User",
        email: "demo@liza.ai",
        image: null,
    };

    return (
        <DashboardClient
            user={mockUser}
            translations={{
                welcome: t("welcome"),
                subtitle: t("subtitle"),
                signOut: t("signOut"),
                quickActions: t("quickActions"),
                researchContent: t("researchContent"),
                schedulePosts: t("schedulePosts"),
                viewAnalytics: t("viewAnalytics"),
                manageAccounts: t("manageAccounts"),
            }}
        />
    );
}
