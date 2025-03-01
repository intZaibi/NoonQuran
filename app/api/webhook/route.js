import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import db from "@/utils/db";
import mailer from "@/utils/mailer";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const dynamic = "force-dynamic"; // or any appropriate configuration

export async function POST(req, res) {
  const body = await req.text();
  const header = await headers();
  const sig = header.get("Stripe-Signature");

  let event;

  try {
    // Verify the webhook signature using the raw body and secret
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json(
      { send: `Webhook Error: ${err.message}` },
      { status: 200 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { metadata, customer_email } = session;
    const idempotencyKey = metadata.idempotencyKey;
    console.log("key: ", idempotencyKey);

    await stripe.checkout.sessions.listLineItems(session.id);

    mailer({email: customer_email, name: metadata.name});
    saveOrderToDatabase(idempotencyKey);

  } else {
    const session = event.data.object;
    const idempotencyKey = session.metadata.idempotencyKey;
    await db.query(
      `
      UPDATE payments SET payment_status
      = ? WHERE idempotencyKey = ?
    `,
      ["failed", idempotencyKey]
    );
  }

  return NextResponse.json({ received: true }, { status: 200 });
}



const saveOrderToDatabase = async (idempotencyKey) => {
  await db.query(
    `
    UPDATE payments SET payment_status
    = ? WHERE idempotencyKey = ?
  `,
    ["completed", idempotencyKey]
  );
};




