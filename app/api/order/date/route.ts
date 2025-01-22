import { getOrdersFromDates } from 'modules/firebase/database';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  let startDate: any = searchParams.get('startDate');
  let endDate: any = searchParams.get('endDate');

  if (!startDate || !endDate)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  startDate = new Date(Number(startDate)).setHours(0, 0, 0, 0);
  endDate = new Date(Number(endDate)).setHours(23, 59, 59, 999);

  console.log(
    new Date(startDate).toLocaleString(),
    new Date(endDate).toLocaleString(),
    startDate,
    endDate
  );

  try {
    const orders = await getOrdersFromDates(startDate, endDate);

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
