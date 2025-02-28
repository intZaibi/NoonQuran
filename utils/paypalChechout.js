async function generateAccessToken() {
  const response = await fetch(
    process.env.PAYPAL_BASE_URL + "/v1/oauth2/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
      // Using Basic Auth with the `Authorization` header (encoded client_id:secret)
      credentials: "same-origin", // or 'include' if cross-origin
      headers: {
        Authorization:
          "Basic " +
          btoa(process.env.PAYPAL_CLIENT_ID + ":" + process.env.PAYPAL_SECRET),
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  // If you need to parse the response as JSON:
  const data = await response.json();

  return data.access_token;
}

export const createOrder = async ({ name, course, totalPrice, currency, idempotencyKey }) => {
  const accessToken = await generateAccessToken();
  
  const response = await fetch(
    process.env.PAYPAL_BASE_URL + "/v2/checkout/orders",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            reference_id: idempotencyKey, // Reference ID added here
            items: [
              {
                name,
                description: `${course} purchased by ${name}`,
                quantity: 1,
                unit_amount: {
                  currency_code: currency,
                  value: totalPrice,
                },
              },
            ],
            amount: {
              currency_code: currency,
              value: totalPrice,
              breakdown: {
                item_total: {
                  currency_code: currency,
                  value: totalPrice,
                },
              },
            },
          },
        ],
        application_context: {
          return_url: process.env.BASE_URL + "/api/checkout",
          cancel_url: "https://noonquran.com/",
          shipping_preference: "NO_SHIPPING",
          user_action: "PAY_NOW",
          brand_name: "Noon Quran",
          locale: "fr_FR", // French as an example
        },
      }),
    }
  );
  

  // If you need to parse the response as JSON:
  const data = await response.json();
  console.log('data: ', data)
  if(data.links.length === 4)
    return data.links.find((link) => link.rel === "approve").href;
  else
    return data.details[0].issue

};

export const capturePayment = async (orderId) => {
  const accessToken = await generateAccessToken();

  const response = await fetch(
    process.env.PAYPAL_BASE_URL + `/v2/checkout/orders/${orderId}/capture`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    }
  );

  // If you need to parse the response as JSON:
  const data = await response.json();

  return data;
};
