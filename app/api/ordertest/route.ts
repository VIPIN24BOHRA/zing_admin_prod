import { NextRequest, NextResponse } from 'next/server';
import { getOrders } from 'modules/firebase/database';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const offset = searchParams.get('offset') || 'z'; 
  console.log(offset ,typeof(offset)) ;
  const limit = parseInt(searchParams.get('limit') || '50');

  try {
    const snapshot = await getOrders(offset, limit);
    if (!snapshot) {
      return NextResponse.json({ orders: [], total: 0 });
    }

    const data = snapshot.val();
    const orders = Object.keys(data).map((key) => ({ key, ...data[key] }));

    return NextResponse.json({ orders, total: orders.length });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
