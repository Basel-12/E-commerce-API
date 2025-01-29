import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


export const createPaymentIntent = async (amount , metadata) => {
    const paymentintent = await stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        metadata,
        payment_method_types: ["card"],
    })
    return paymentintent.client_secret;
}
