import { getDatabase, ref, query, orderByChild, startAt, limitToFirst, get } from 'firebase/database';
import { app } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const offset = searchParams.get('offset') || '0';
  const limit = searchParams.get('limit') || '50';

  try {
    const db = getDatabase(app);
    const ordersRef = ref(db, 'orders/');
    const ordersQuery = query(
      ordersRef,
      orderByChild('orderNo'), 
      startAt(Number(offset)),
      limitToFirst(Number(limit)) 
    );

    const snapshot = await get(ordersQuery);
    if (!snapshot.exists()) {
      return NextResponse.json({ orders: [], total: 0 });
    }

    const data = snapshot.val();
    const orders = Object.keys(data).map((key) => ({ key, ...data[key] }));

    return NextResponse.json({ orders, total: orders.length });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
