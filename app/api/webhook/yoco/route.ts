import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import crypto from "crypto";
import { db } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const body = await req.text();
        const headersList = await headers();
        const signature = headersList.get("webhook-signature");

        if (!signature) {
            return new NextResponse("Missing signature", { status: 400 });
        }

        const secret = process.env.YOCO_WEBHOOK_SECRET;

        if (!secret) {
            console.error("YOCO_WEBHOOK_SECRET is not set");
            return new NextResponse("Server configuration error", { status: 500 });
        }

        // Verify signature with HMAC-SHA256
        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(body)
            .digest("hex");

        const signatureParts = signature.split(/[, ]+/);
        const isValid = signatureParts.some(part => {
            return part === expectedSignature || part === `v1=${expectedSignature}`;
        });

        if (!isValid) {
            console.error("Invalid webhook signature");
            return new NextResponse("Invalid signature", { status: 401 });
        }

        const event = JSON.parse(body);
        const { type, payload } = event;

        if (type === "payment.succeeded") {
            const { metadata, id } = payload;
            const orgId = metadata?.orgId;

            if (orgId) {
                const currentPeriodEnd = new Date();
                currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + 1);

                await db.orgSubscription.upsert({
                    where: { orgId },
                    update: {
                        status: "active",
                        planType: "pro",
                        externalId: id,
                        currentPeriodEnd,
                    },
                    create: {
                        orgId,
                        status: "active",
                        planType: "pro",
                        externalId: id,
                        currentPeriodEnd,
                    },
                });

                // Force cache invalidation
                revalidatePath("/");
                revalidatePath(`/organization/${orgId}`);
            }
        }

        return new NextResponse(null, { status: 200 });

    } catch (error) {
        console.error("Webhook error:", error);
        return new NextResponse("Webhook handler failed", { status: 500 });
    }
}

// GET handler for webhook verification (some providers ping this to verify the endpoint)
export async function GET() {
    return new NextResponse("Webhook endpoint is active", { status: 200 });
}
