/* eslint-disable import/extensions */
import { addNewPaymentDeatils } from 'modules/firebase/database';
import { NextRequest, NextResponse } from 'next/server';
import cookie from 'cookie';
import { createOrderApi, generateRiderToken } from '@/lib/riderHelper';

export async function GET(req: NextRequest) {
  return NextResponse.json('create rider order is up and running');
}

export async function POST(req: NextRequest) {
  try {
    const cookies = cookie.parse(req.headers.get('cookie') || '');
    let token = cookies.token; // Assuming JWT is stored in 'token' cookie

    if (!token) {
      const response = NextResponse.json({
        success: false,
        message: 'not authenticated'
      });
      return response;
    }

    const order = await req.json();

    const parsedOrder = {
      id: order.orderNo ? String(order.orderNo) : '',
      customer: {
        name: order.uid,
        number: order.uid
      },
      delivery_address: {
        line_1: order.address.houseDetails,
        line_2: order.address.landmark,
        google_address: order.address.title,
        geom: {
          latitude: order.address.lat,
          longitude: order.address.lng
        },
        landmark: order.address.landmark
      },
      items: order.cartItems.map((items: any) => ({
        quantity: items.quantity,
        name: items.item.title,
        amount: items.item.price
      })),

      delivery_boy_number: '',
      delivery_instructions: order.key,
      outlet_id: '5356eb5f-82d7-447e-a4b0-58b4e245af08',
      external_outlet_id: '',
      total:
        order.totalPrice +
        order.deliveryFee +
        order.tax +
        order.smallCartFee -
        order.discount,
      sub_total:
        order.totalPrice +
        order.deliveryFee +
        order.tax +
        order.smallCartFee -
        order.discount,
      prep_time: 4,
      payment_type: order.transactionDetails ? 'PAID' : 'COD'
    };

    const res = await createOrderApi(
      token,
      parsedOrder,
      process.env.RIDER_BRAND_KEY ?? ''
    );

    return NextResponse.json({
      success: true
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return NextResponse.json({ success: false, error: e });
  }
}
