import {
  getOrdersFromDates,
  getRatingsFromOrderIds
} from 'modules/firebase/database';
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
  startDate = Number(startDate);
  endDate = Number(endDate);

  console.log(
    new Date(startDate).toLocaleString(),
    new Date(endDate).toLocaleString(),
    startDate,
    endDate
  );

  try {
    let orders = await getOrdersFromDates(startDate, endDate);
    const orderKeys = Object.keys(orders ?? {});
    let ratings = await getRatingsFromOrderIds(
      orderKeys[0],
      orderKeys[orderKeys.length - 1]
    );

    if (!ratings) ratings = {};
    orders = orderKeys.map((key) => ({
      key,
      ...orders[key],
      rating: ratings[key] ? Object.values(ratings[key])[0] : {}
    }));

    return NextResponse.json({ data: orders, total: orders.length });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
