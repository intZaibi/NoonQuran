import axios from 'axios';
// Function to convert any currency to AED
export default async function convertToAED(amount, fromCurrency, toUSD) {
    const url = `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_KEY}/latest/${fromCurrency}`;
    
    try {
        // Fetch exchange rates for the 'fromCurrency'
        const response = await axios.get(url);

        // Extract the exchange rate for AED
        const exchangeRate = toUSD ? response.data.conversion_rates.USD : response.data.conversion_rates.AED;

        if (!exchangeRate) {
            console.log(`Error: Exchange rate for AED not found for ${fromCurrency}`);
            return `Error: Exchange rate for AED not found for ${fromCurrency}`;
        }

        // Perform the conversion
        const convertedAmount = amount * exchangeRate;
        return convertedAmount
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
        return `Error fetching exchange rates`
    }
}

