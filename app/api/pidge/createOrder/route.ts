/* eslint-disable import/extensions */
import { addNewPaymentDeatils } from 'modules/firebase/database';
import { NextRequest, NextResponse } from 'next/server';
import cookie from 'cookie';
import {
  createOrderApi,
  createPidgeOrder,
  generateRiderToken
} from '@/lib/riderHelper';

export async function GET(req: NextRequest) {
  return NextResponse.json('create pidge order is up and running');
}

export async function POST(req: NextRequest) {
  try {
    const cookies = cookie.parse(req.headers.get('cookie') || '');
    let token = cookies.pidgeToken; // Assuming JWT is stored in 'token' cookie

    if (!token) {
      const response = NextResponse.json({
        success: false,
        message: 'not authenticated'
      });
      return response;
    }

    const order = await req.json();

    const parsedOrder = {
      brand: {
        code: 'zing001',
        name: 'zing_cyber_park'
      },
      channel: 'zing_app',
      sender_detail: {
        address: {
          address_line_1: 'zing outlet',
          landmark: 'The amore boutique salon',
          city: 'gurgaon',
          state: 'Delhi',
          country: 'India',
          pincode: '122003',
          latitude: 28.443304,
          longitude: 77.066742
        },
        name: 'zing',
        mobile: '9871488641'
      },
      poc_detail: {
        name: 'zing',
        mobile: '9871488641'
      },

      trips: [
        {
          receiver_detail: {
            address: {
              address_line_1: order.address.title,
              address_line_2: order.address.houseDetails,
              landmark: order.address.landmark,
              city: 'Delhi',
              state: 'Delhi',
              country: 'India',
              pincode: '122003',
              latitude: order.address.lat,
              longitude: order.address.lng
            },
            name:order.name || order.uid,
            mobile: order.uid
          },

          source_order_id: order.key,
          reference_id: order.orderNo ? String(order.orderNo) : '',
          cod_amount: order.transactionDetails
            ? 0
            : order.totalPrice + order.deliveryFee - order.discount,
          bill_amount: order.totalPrice + order.deliveryFee - order.discount,
          products: order.cartItems.map((items: any) => ({
            quantity: items.quantity,
            name: items.item.title,
            price: items.item.price
          }))
        }
      ]
    };

    const res = await createPidgeOrder(parsedOrder, token);

    return NextResponse.json({
      success: true
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return NextResponse.json({ success: false, error: e });
  }
}
