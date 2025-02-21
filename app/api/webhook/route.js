import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import nodemailer from 'nodemailer'
import db from "@/utils/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const dynamic = "force-dynamic"; // or any appropriate configuration

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for port 465, false for other ports
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

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

    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

    const products = lineItems.data.map((item) => {
      console.log(item);
      return {
        description: item.description,
        quantity: item.quantity,
      };
    });
    console.log("Payment for:", products);
    console.log('calling mailer...')
    mailer({email: customer_email, name: metadata.name});
    console.log('Storing data...')
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



const mailer = async (details) => {
  console.log('sending mail...')
  const info = await transporter.sendMail({
    from: `"Noon Quran" <${process.env.EMAIL_USERNAME}>`, // sender address
    to: details.email, // list of receivers
    subject: "Thank You for Your Purchase – We'll Connect with You Soon!", // Subject line
    text: `Dear ${details.name},

    Thank you so much for your course purchase! We truly appreciate your trust and support.

    We wanted to let you know that we’re currently processing your purchase and will be in touch with you shortly to provide any updates or answer any questions you may have.

    If you have any immediate inquiries or need assistance in the meantime, please feel free to reply to this email or reach out to our customer support team at +971 52 452 5060.

    Thank you again for choosing us. We look forward to serving you!

    Best regards,
    Noon Quran
    +971 52 452 5060
    https://noonquran.com/`,
  });

  console.log("Message sent: %s", info.messageId); // Message Sent log
};
