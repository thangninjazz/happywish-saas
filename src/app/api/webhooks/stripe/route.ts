import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia',
});

// Since this is a webhook, we must use the Service Role Key to bypass RLS
// because there is no user session here.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Note: Ensure this is in your .env
);

export async function POST(req: Request) {
  const payload = await req.text();
  const signature = req.headers.get('Stripe-Signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const wishId = session.metadata?.wishId;
    const userId = session.metadata?.userId;

    if (wishId && userId) {
      // 1. Update wish status
      const { error: updateError } = await supabaseAdmin
        .from('wishes')
        .update({ status: 'active' })
        .eq('id', wishId);

      if (updateError) {
        console.error('Error updating wish status:', updateError);
      }

      // 2. Create order record
      const { error: insertError } = await supabaseAdmin
        .from('orders')
        .insert({
          user_id: userId,
          wish_id: wishId,
          stripe_session_id: session.id,
          amount: session.amount_total || 0,
          status: 'completed',
        });

      if (insertError) {
         console.error('Error recording order:', insertError);
      }
    }
  }

  return NextResponse.json({ received: true });
}
