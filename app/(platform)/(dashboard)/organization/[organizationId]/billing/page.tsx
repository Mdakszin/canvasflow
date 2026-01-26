import { getSubscriptionDetails } from "@/lib/subscription";
import { SubscriptionCard } from "@/components/billing/subscription-card";

const BillingPage = async () => {
    const subscription = await getSubscriptionDetails();

    return (
        <div className="w-full">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Billing</h1>
                <p className="text-muted-foreground text-sm">
                    View and manage your organization&apos;s subscription
                </p>
            </div>
            <SubscriptionCard
                isPro={subscription.isPro}
                status={subscription.status}
                plan={subscription.plan}
                currentPeriodEnd={subscription.currentPeriodEnd}
            />
        </div>
    );
};

export default BillingPage;
