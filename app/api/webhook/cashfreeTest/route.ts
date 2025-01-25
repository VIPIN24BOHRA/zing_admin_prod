/* eslint-disable import/extensions */
import {
  createOrderTEST,
  getPendingOrder,
  savePaymentDetailsTEST
} from 'modules/firebase/database';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  return NextResponse.json('webhook is up and running');
}

const payObj3 = {
  data: {
    order: {
      order_id: 'FnZcVoxeN1vDmQMP',
      order_amount: 278,
      order_currency: 'INR',
      order_tags: null
    },
    payment: {
      cf_payment_id: '5114915856863',
      payment_status: 'SUCCESS',
      payment_amount: 278,
      payment_currency: 'INR',
      payment_message: 'Simulated response message',
      payment_time: '2025-01-24T18:45:44+05:30',
      bank_reference: '1234567890',
      auth_id: null,
      payment_method: [Object],
      payment_group: 'upi'
    },
    customer_details: {
      customer_name: null,
      customer_id: '919389440670',
      customer_email: null,
      customer_phone: '919389440670'
    },
    payment_gateway_details: {
      gateway_name: 'CASHFREE',
      gateway_order_id: '2189313921',
      gateway_payment_id: '5114915856863',
      gateway_status_code: null,
      gateway_order_reference_id: 'null',
      gateway_settlement: 'CASHFREE',
      gateway_reference_name: null
    },
    payment_offers: null
  },
  event_time: '2025-01-24T18:46:02+05:30',
  type: 'PAYMENT_SUCCESS_WEBHOOK'
};

export async function POST(req: NextRequest) {
  try {
    const response = await req.json();

    if (
      response &&
      response.type == 'PAYMENT_SUCCESS_WEBHOOK' &&
      !response.data?.payment_gateway_details
    ) {
      const { order, payment } = response;

      const pendingOrder = await getPendingOrder(order.order_id);

      const transactionDetail = {
        cfOrderId: payment.cf_payment_id,
        orderId: order.order_id,
        status:
          payment.payment_status == 'SUCCESS' ? 'PAID' : payment.payment_status
      };

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
      const { order, payment } = response;
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
