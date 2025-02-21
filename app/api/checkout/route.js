import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import db from '@/utils/db.js'
import {v4 as uuid} from 'uuid'
import currencyConverter from '@/utils/currencyConverter.js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  console.log("reached to checkout api...")

    const {formData} = await req.json()
    console.log(formData)
    const { country, class_days, no_of_siblings, course, email, name} =  formData
    const priceData = {
      UAE: {
          "5-days": { base: 220.00, sibling: 172.00 },
          "4-days": { base: 205.00, sibling: 164.00 },
          "3-days": { base: 150.00, sibling: 120.00 },
          "2-days-1": { base: 115.00, sibling: 92.00 },
          "2-days-2": { base: 115.00, sibling: 92.00 },
          "2-days-3": { base: 115.00, sibling: 92.00 }
      },
      Bahrain: {
          "5-days": { base: 22.70, sibling: 18.00 },
          "4-days": { base: 21.20, sibling: 17.00 },
          "3-days": { base: 16.20, sibling: 12.00 },
          "2-days-1": { base: 12.25, sibling: 10.00 },
          "2-days-2": { base: 12.25, sibling: 10.00 },
          "2-days-3": { base: 12.25, sibling: 10.00 }
      },
      Qatar: {
          "5-days": { base: 220.00, sibling: 172.00 },
          "4-days": { base: 205.00, sibling: 165.00 },
          "3-days": { base: 150.00, sibling: 118.00 },
          "2-days-1": { base: 115.00, sibling: 91.00 },
          "2-days-2": { base: 115.00, sibling: 91.00 },
          "2-days-3": { base: 115.00, sibling: 91.00 }
      },
      KSA: {
          "5-days": { base: 227.50, sibling: 182.00 },
          "4-days": { base: 205.00, sibling: 164.00 },
          "3-days": { base: 160.00, sibling: 128.00 },
          "2-days-1": { base: 120.00, sibling: 96.00 },
          "2-days-2": { base: 120.00, sibling: 96.00 },
          "2-days-3": { base: 120.00, sibling: 96.00 }
      },
      Kuwait: {
          "5-days": { base: 18.50, sibling: 14.80 },
          "4-days": { base: 17.25, sibling: 13.80 },
          "3-days": { base: 12.75, sibling: 10.20 },
          "2-days-1": { base: 9.75, sibling: 7.80 },
          "2-days-2": { base: 9.75, sibling: 7.80 },
          "2-days-3": { base: 9.75, sibling: 7.80 }
      },
      UK: {
          "5-days": { base: 45.60, sibling: 36.10 },
          "4-days": { base: 38.00, sibling: 30.40 },
          "3-days": { base: 30.40, sibling: 24.70 },
          "2-days-1": { base: 22.80, sibling: 18.05 },
          "2-days-2": { base: 22.80, sibling: 18.05 },
          "2-days-3": { base: 22.80, sibling: 18.05 }
      },
      USA_Canada: {
          "5-days": { base: 70.30, sibling: 57.00 },
          "4-days": { base: 58.90, sibling: 47.50 },
          "3-days": { base: 47.50, sibling: 38.00 },
          "2-days-1": { base: 35.15, sibling: 28.50 },
          "2-days-2": { base: 35.15, sibling: 28.50 },
          "2-days-3": { base: 35.15, sibling: 28.50 }
      },
      Europe: {
          "5-days": { base: 53.20, sibling: 42.75 },
          "4-days": { base: 44.65, sibling: 36.10 },
          "3-days": { base: 36.10, sibling: 28.50 },
          "2-days-1": { base: 26.60, sibling: 20.90 },
          "2-days-2": { base: 26.60, sibling: 20.90 },
          "2-days-3": { base: 26.60, sibling: 20.90 }
      },
      Australia: {
          "5-days": { base: 85.50, sibling: 68.40 },
          "4-days": { base: 71.25, sibling: 57.00 },
          "3-days": { base: 57.00, sibling: 45.60 },
          "2-days-1": { base: 42.75, sibling: 34.20 },
          "2-days-2": { base: 42.75, sibling: 34.20 },
          "2-days-3": { base: 42.75, sibling: 34.20 }
      },
    };
    const currencySymbols = {
      UAE: 'AED',
      Bahrain: 'BHD',
      Qatar: 'QAR',
      KSA: 'SAR',
      Kuwait: 'KWD',
      UK: 'GBP',
      USA_Canada: 'USD',
      Europe: 'EUR',
      Australia: 'AUD'
    };
    const currency = currencySymbols[country] || currencySymbols['USA_Canada']


  function updatePrice() {

    const prices = priceData[country] || priceData['USA_Canada'];
    let basePrice = 0;
    let siblingPrice = 0;

    basePrice = prices[class_days].base || 0;
    siblingPrice = no_of_siblings > 0 ? prices[class_days].sibling * no_of_siblings : 0;
    
    const totalPrice = basePrice + siblingPrice;
    return { totalPrice: totalPrice, currency }; // Return the total price and currency
  }

  const TP = updatePrice();
  const idempotencyKey = uuid(); // for unique record in DB
    try {
      
      const session = await stripe.checkout.sessions.create({
        line_items: [{
          price_data: {
            product_data: {
              name: course,
              // images: image,
            },
            currency: TP.currency,
            unit_amount: currency === 'KWD' || currency === 'BHD' ? Number((TP.totalPrice * 1000).toFixed(2)) : Number((TP.totalPrice * 100).toFixed(2)),
          },
          quantity: 1,
        }],
        mode: 'payment',
        submit_type: 'pay',
        billing_address_collection: 'auto',
        customer_email: email,
        metadata: {
          idempotencyKey,
          name
        },
        success_url: `https://noonquran.com/`,
        cancel_url: `https://noonquran.com/`,
      });

      // currency conversion to be stored in database in AED
      const data = await currencyConverter(formData.total_price, currency)
      if(typeof data === 'string' && data.includes('Error')) throw new Error( data);
      await db.query(`INSERT INTO payments(name, email, whatsapp_no, phone, skype_id, guardian_name, gender, age, language, class_time, course, class_days, no_of_siblings, country, total_price, idempotencyKey) VALUE (?)`, 
        [[
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
        data,  //total_amount was named as data while currency conversion
        idempotencyKey
        ]])

        const { siblings } = formData
        if (siblings.length > 0) {
          
          for (const sibling of siblings) {
            await db.query(`INSERT INTO siblings (reference_name ,name, gender, age, course, idempotencyKey) VALUE (?)`, 
              [[
              formData.name,
              sibling.name,
              sibling.gender,
              sibling.age,
              sibling.course,
              idempotencyKey
              ]])
          }
        }

      return NextResponse.json({ url: session.url }, { status: 200 });

    } catch (err) {
      console.error('Error: ', err);
      return NextResponse.json({ error: err }, { status: 500 });
    }
}