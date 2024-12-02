/* eslint-disable import/extensions */
import { addNewPaymentDeatils } from 'modules/firebase/database';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  return NextResponse.json('webhook is up and running');
}

export async function POST(req: NextRequest) {
  try {
    const xVerifyHeader = req.headers.get('x-verify');
    console.log(xVerifyHeader);
    const { response } = await req.json();

    if (response) {
      const payment = atob(response);
      console.log(payment);
      if (payment) {
        const paymentDetails = JSON.parse(payment);
        const paymentModel = {
          merchantTransactionId: paymentDetails?.data?.merchantTransactionId,
          state: paymentDetails?.data?.state,
          transactionId: paymentDetails?.data?.transactionId,
          amount: paymentDetails?.data?.amount,
          type: paymentDetails?.data?.paymentInstrument?.type,
          merchantId: paymentDetails?.data?.merchantId,
          code: paymentDetails?.code,
          message: paymentDetails?.message
        };

        await addNewPaymentDeatils(paymentModel);
      }
    }
    return NextResponse.json({
      success: true
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return NextResponse.json({ success: false, error: e });
  }
}
