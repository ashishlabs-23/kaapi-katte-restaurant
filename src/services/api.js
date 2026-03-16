/**
 * KAAPI KATTE API SERVICE
 * Bridge between the React Frontend and Google Apps Script Backend
 */

// NOTE: Real Backend URL deployed by the owner
const BACKEND_URL = "https://script.google.com/macros/s/AKfycbwjMwCGYCjlVulghFUXlm3BWW9j6VBnnoNcRqG3MoSvz-Gqr2nItRTV-k1w2uEl__Ut/exec";

export const apiService = {
    /**
     * Creates a Razorpay Order via the Google Apps Script
     */
    async createOrder(amount) {
        if (BACKEND_URL === 'PLACEHOLDER_URL') {
            console.error('Backend URL not set. Please provide the Google Apps Script Web App URL.');
            throw new Error('Backend configuration missing');
        }

        const response = await fetch(BACKEND_URL, {
            method: 'POST',
            body: JSON.stringify({
                action: 'createOrder',
                amount: amount
            })
        });
        return await response.json();
    },

    /**
     * Records a successful payment in the Google Sheet
     */
    async recordPayment(paymentData) {
        // We use text/plain to bypass CORS preflight which Google Apps Script struggles with
        // mode: 'no-cors' is used to ensure the request is sent even if we can't read the response
        try {
            await fetch(BACKEND_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: JSON.stringify({
                    action: 'recordPayment',
                    ...paymentData,
                    // Ensure nested structures are flattened/stringified for Spreadsheet compatibility
                    items: typeof paymentData.items === 'object' ? JSON.stringify(paymentData.items) : paymentData.items
                })
            });
            return { status: 'success' }; // Assume success in no-cors mode
        } catch (error) {
            console.warn('Silent failure in recordPayment, likely CORS but request might have gone through.');
            throw error;
        }
    },

    /**
     * Fetches daily statistics for the Owner Dashboard
     */
    async getDailyStats() {
        const response = await fetch(BACKEND_URL);
        if (!response.ok) throw new Error('Stats fetch failed');
        return await response.json();
    }
};
