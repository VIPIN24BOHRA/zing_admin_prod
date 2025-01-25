/* eslint-disable import/extensions */
import {
  createOrderTEST,
  getPendingOrder,
  getPendingOrderTEST,
  savePaymentDetailsTEST
} from 'modules/firebase/database';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  return NextResponse.json('webhook is up and running');
}

export async function POST(req: NextRequest) {
  try {
    const response = await req.json();
    console.log(response);

    if (
      response &&
      response.type == 'PAYMENT_SUCCESS_WEBHOOK' &&
      !response.data?.payment_gateway_details
    ) {
      const { order, payment } = response.data;
      console.log(order, payment);

      const pendingOrder = await getPendingOrderTEST(order.order_id);

      const transactionDetail = {
        cfOrderId: payment.cf_payment_id,
        orderId: order.order_id,
        status:
          payment.payment_status == 'SUCCESS' ? 'PAID' : payment.payment_status
      };
      console.log(pendingOrder, transactionDetail);

      // create order.
      await createOrderTEST(pendingOrder, transactionDetail);

      await savePaymentDetailsTEST({
        order,
        payment,
        orderStatus:
          payment.payment_status == 'SUCCESS' ? 'PAID' : payment.payment_status
      });

      // save payment details in /payment/cashfree
    } else if (response && response.type == 'PAYMENT_FAILED_WEBHOOK') {
      const { order, payment } = response.data;
      await savePaymentDetailsTEST({
        order,
        payment,
        orderStatus:
          payment.payment_status == 'SUCCESS' ? 'PAID' : payment.payment_status
      });
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
