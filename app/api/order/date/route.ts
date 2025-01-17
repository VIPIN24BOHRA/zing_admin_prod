import { getOrdersFromDates } from 'modules/firebase/database';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  try {
    const orders = await getOrdersFromDates(startDate!, endDate!);
    console.log(orders);
    const formattedOrders = orders
      ? Object.entries(orders).map(([id, value]) => ({ id, ...value }))
      : [];
    return NextResponse.json({
      data: formattedOrders,
      total: formattedOrders.length
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
