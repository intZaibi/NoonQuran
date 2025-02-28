import { NextResponse } from "next/server";
import Stripe from "stripe";
import db from "@/utils/db.js";
import { v4 as uuid } from "uuid";
import currencyConverter from "@/utils/currencyConverter.js";
import { createOrder, capturePayment } from "@/utils/paypalChechout";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  console.log("reached to checkout api...");

  const { formData } = await req.json();
  console.log(formData);
  const {
    country,
    class_days,
    no_of_siblings,
    course,
    email,
    name,
    paymentMethod,
  } = formData;
  const priceData = {
    UAE: {
      "5-days": { base: 220.0, sibling: 172.0 },
      "4-days": { base: 205.0, sibling: 164.0 },
      "3-days": { base: 150.0, sibling: 120.0 },
      "2-days-1": { base: 115.0, sibling: 92.0 },
      "2-days-2": { base: 115.0, sibling: 92.0 },
      "2-days-3": { base: 115.0, sibling: 92.0 },
    },
    Bahrain: {
      "5-days": { base: 22.7, sibling: 18.0 },
      "4-days": { base: 21.2, sibling: 17.0 },
      "3-days": { base: 16.2, sibling: 12.0 },
      "2-days-1": { base: 12.25, sibling: 10.0 },
      "2-days-2": { base: 12.25, sibling: 10.0 },
      "2-days-3": { base: 12.25, sibling: 10.0 },
    },
    Qatar: {
      "5-days": { base: 220.0, sibling: 172.0 },
      "4-days": { base: 205.0, sibling: 165.0 },
      "3-days": { base: 150.0, sibling: 118.0 },
      "2-days-1": { base: 115.0, sibling: 91.0 },
      "2-days-2": { base: 115.0, sibling: 91.0 },
      "2-days-3": { base: 115.0, sibling: 91.0 },
    },
    KSA: {
      "5-days": { base: 227.5, sibling: 182.0 },
      "4-days": { base: 205.0, sibling: 164.0 },
      "3-days": { base: 160.0, sibling: 128.0 },
      "2-days-1": { base: 120.0, sibling: 96.0 },
      "2-days-2": { base: 120.0, sibling: 96.0 },
      "2-days-3": { base: 120.0, sibling: 96.0 },
    },
    Kuwait: {
      "5-days": { base: 18.5, sibling: 14.8 },
      "4-days": { base: 17.25, sibling: 13.8 },
      "3-days": { base: 12.75, sibling: 10.2 },
      "2-days-1": { base: 9.75, sibling: 7.8 },
      "2-days-2": { base: 9.75, sibling: 7.8 },
      "2-days-3": { base: 9.75, sibling: 7.8 },
    },
    UK: {
      "5-days": { base: 45.6, sibling: 36.1 },
      "4-days": { base: 38.0, sibling: 30.4 },
      "3-days": { base: 30.4, sibling: 24.7 },
      "2-days-1": { base: 22.8, sibling: 18.05 },
      "2-days-2": { base: 22.8, sibling: 18.05 },
      "2-days-3": { base: 22.8, sibling: 18.05 },
    },
    USA_Canada: {
      "5-days": { base: 70.3, sibling: 57.0 },
      "4-days": { base: 58.9, sibling: 47.5 },
      "3-days": { base: 47.5, sibling: 38.0 },
      "2-days-1": { base: 35.15, sibling: 28.5 },
      "2-days-2": { base: 35.15, sibling: 28.5 },
      "2-days-3": { base: 35.15, sibling: 28.5 },
    },
    Europe: {
      "5-days": { base: 53.2, sibling: 42.75 },
      "4-days": { base: 44.65, sibling: 36.1 },
      "3-days": { base: 36.1, sibling: 28.5 },
      "2-days-1": { base: 26.6, sibling: 20.9 },
      "2-days-2": { base: 26.6, sibling: 20.9 },
      "2-days-3": { base: 26.6, sibling: 20.9 },
    },
    Australia: {
      "5-days": { base: 85.5, sibling: 68.4 },
      "4-days": { base: 71.25, sibling: 57.0 },
      "3-days": { base: 57.0, sibling: 45.6 },
      "2-days-1": { base: 42.75, sibling: 34.2 },
      "2-days-2": { base: 42.75, sibling: 34.2 },
      "2-days-3": { base: 42.75, sibling: 34.2 },
    },
  };
  const currencySymbols = {
    UAE: "AED",
    Bahrain: "BHD",
    Qatar: "QAR",
    KSA: "SAR",
    Kuwait: "KWD",
    UK: "GBP",
    USA_Canada: "USD",
    Europe: "EUR",
    Australia: "AUD",
  };
  const currency = currencySymbols[country] || currencySymbols["USA_Canada"];

  function updatePrice() {
    const prices = priceData[country] || priceData["USA_Canada"];
    let basePrice = 0;
    let siblingPrice = 0;

    basePrice = prices[class_days].base || 0;
    siblingPrice =
      no_of_siblings > 0 ? prices[class_days].sibling * no_of_siblings : 0;

    const totalPrice = basePrice + siblingPrice;
    return { totalPrice, currency }; // Return the total price and currency
  }

  const TP = updatePrice();
  const idempotencyKey = uuid(); // for unique record in DB
  try {
    let url;
    if (paymentMethod === "Stripe") {
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              product_data: {
                name: course,
                // images: image,
              },
              currency: TP.currency,
              unit_amount:
                currency === "KWD" || currency === "BHD"
                  ? Number((TP.totalPrice * 1000).toFixed(2))
                  : Number((TP.totalPrice * 100).toFixed(2)),
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        submit_type: "pay",
        billing_address_collection: "auto",
        customer_email: email,
        metadata: {
          idempotencyKey,
          name,
        },
        success_url: `https://noonquran.com/`,
        cancel_url: `https://noonquran.com/`,
      });

      url = session.url;
    } else if (paymentMethod === "Paypal") {
      url = await createOrder({ name, ...TP, course, idempotencyKey });
    }

    // currency conversion to be stored in database in AED
    const data = await currencyConverter(formData.total_price, currency);
    if (typeof data === "string" && data.includes("Error"))
      throw new Error(data);
    await db.query(
      `INSERT INTO payments(name, email, whatsapp_no, phone, skype_id, guardian_name, gender, age, language, class_time, course, class_days, no_of_siblings, country, total_price, idempotencyKey) VALUE (?)`,
      [
        [
          formData.name,
          formData.email,
          formData.whatsapp_no,
          formData.phone,
          formData.skype_id,
          formData.guardian_name,
          formData.gender,
          formData.age,
          formData.language,
          formData.class_time,
          formData.course,
          formData.class_days,
          formData.no_of_siblings,
          formData.country,
          data, //total_amount was named as data while currency conversion
          idempotencyKey,
        ],
      ]
    );

    const { siblings } = formData;
    if (siblings.length > 0) {
      for (const sibling of siblings) {
        await db.query(
          `INSERT INTO siblings (reference_name ,name, gender, age, course, idempotencyKey) VALUE (?)`,
          [
            [
              formData.name,
              sibling.name,
              sibling.gender,
              sibling.age,
              sibling.course,
              idempotencyKey,
            ],
          ]
        );
      }
    }

    return NextResponse.json({ url: 'url' }, { status: 200 });
  } catch (err) {
    console.error("Error: ", err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}



export async function GET(req) {
  const urlObj = new URL(req.url);
  const token = urlObj.searchParams.get("token");

  try {
    const res = await capturePayment(token);

    if(res.status === "COMPLETED"){

      const idempotencyKey = res.purchase_units[0].reference_id;
      await db.query(
        `
        UPDATE payments SET payment_status
        = ? WHERE idempotencyKey = ?
      `,
        ["completed", idempotencyKey]
      );
    }

    return NextResponse.redirect('https://noonquran.com/');
  } catch (err) {
    console.error("Error: ", err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
