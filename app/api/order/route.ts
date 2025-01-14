import { NextRequest, NextResponse } from 'next/server';
import {
  getOrders,
  getRatingsFromOrderIds,
  updateRating
} from 'modules/firebase/database';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const offset = searchParams.get('offset') || 'z';
  console.log(offset, typeof offset);
  const limit = parseInt(searchParams.get('limit') || '50');

  try {
    const snapshot = await getOrders(offset, limit);
    if (!snapshot) {
      return NextResponse.json({ orders: [], total: 0 });
    }

    const data = snapshot.val();
    const orderkeys = Object.keys(data);

    let ratings = await getRatingsFromOrderIds(
      orderkeys[0],
      orderkeys[orderkeys.length - 1]
    );

    if (!ratings) ratings = {};
    const orders = orderkeys.map((key) => ({
      key,
      ...data[key],
      rating: ratings[key] ? Object.values(ratings[key])[0] : {}
    }));

    return NextResponse.json({ orders, total: orders.length });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const { feedback, orderId, mobileNo } = await req.json();

  if (!orderId || !mobileNo || !feedback)
    return NextResponse.json(
      {
        success: false
      },
      { status: 400 }
    );

  try {
    const res = await updateRating(orderId, mobileNo, feedback);

    return NextResponse.json({ success: res });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update rating', success: false },
      { status: 400 }
    );
  }
}
