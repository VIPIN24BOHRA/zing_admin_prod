import { getAllCategories } from 'modules/firebase/database';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const data = await getAllCategories();

    if (!data) {
      return NextResponse.json({ orders: [], total: 0 });
    }

    const productKeys = Object.keys(data);
    const products = productKeys.map((key) => ({
      id: key,
      ...data[key]
    }));

    return NextResponse.json({ data, total: products.length });
  } catch (err) {
    console.error('Error in GET request:', err);
    return NextResponse.json(
      { message: 'An error occurred while fetching products' },
      { status: 500 }
    );
  }
}
