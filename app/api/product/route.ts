import { fetchUserFromToken } from '@/lib/authHelper';
import { ProductModel } from '@/lib/models';
import { addNewProduct } from 'modules/firebase/database';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: 'Product API is up and running' });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const product: ProductModel = body.product;
    const id: number = body.id;

    // Validate product
    const validationError = validateProduct(product);
    if (validationError) {
      return NextResponse.json(
        { success: false, message: validationError },
        { status: 400 }
      );
    }

    console.log('Product Data:', body);
    await addNewProduct(product, id);

    return NextResponse.json({
      success: true,
      message: 'Product added successfully',
      product: body,
    });
  } catch (e: any) {
    console.error('Error in POST:', e);
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 500 }
    );
  }
}

function validateProduct(product: ProductModel): string | null {
  if (!product.title) return 'Product title is required';
  if (!product.description) return 'Product description is required';
  if (!product.categories) return 'Product categories are required';
  if (typeof product.originalPrice !== 'number' || product.originalPrice <= 0)
    return 'Product original price must be a positive number';
  if (typeof product.price !== 'number' || product.price <= 0)
    return 'Product price must be a positive number';
  if (typeof product.hide !== 'boolean') return 'Product hide must be a boolean value';
  if (typeof product.isVeg !== 'boolean') return 'Product isVeg must be a boolean value';
  if (!product.servingType) return 'Product serving type is required';
  if (!product.quantity) return 'Product quantity is required';
  if (!product.imageUrl) return 'Product image URL is required';
  if (!product.largeImageUrl) return 'Product large image URL is required';
  if (!product.productId || typeof product.productId !== 'number')
    return 'Product ID is required and must be a number';
  return null; 
}
