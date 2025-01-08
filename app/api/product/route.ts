import { fetchUserFromToken } from '@/lib/authHelper';
import { ProductModel } from '@/lib/models';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: 'Product API is up and running' });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
  
    const prod:ProductModel = body;

    if (!prod.title || !prod.description || !prod.categories) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('Product Data:', body);

    return NextResponse.json({
      success: true,
      message: 'Product added successfully',
      product: body
    });
  } catch (e: any) {
    console.error('Error in POST:', e);
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 500 }
    );
  }
}
