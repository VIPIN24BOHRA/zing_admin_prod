import { ProductModel } from '@/lib/models';
import { addNewProduct, getAllProduct } from 'modules/firebase/database';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const data = await getAllProduct();

    if (!data) {
      return NextResponse.json({ orders: [], total: 0 });
    }

    const productKeys = Object.keys(data);
    const products = productKeys.map((key) => ({
      id: key,
      ...data[key]
    }));

    return NextResponse.json({ products, total: products.length });
  } catch (err) {
    console.error('Error in GET request:', err);
    return NextResponse.json(
      { message: 'An error occurred while fetching products' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const product: ProductModel = body.product;
    console.log('api', body);
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

    console.log();

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

function validateProduct(product: ProductModel): string | null {
  if (!product.title) return 'Product title is required';
  if (!product.description) return 'Product description is required';
  if (!product.categories) return 'Product categories are required';
  if (typeof product.originalPrice !== 'number' || product.originalPrice <= 0)
    return 'Product original price must be a positive number';
  if (typeof product.price !== 'number' || product.price <= 0)
    return 'Product price must be a positive number';
  if (typeof product.hide !== 'boolean')
    return 'Product hide must be a boolean value';
  if (typeof product.isVeg !== 'boolean')
    return 'Product isVeg must be a boolean value';
  // if (!product.servingType) return 'Product serving type is required';
  if (!product.quantity) return 'Product quantity is required';
  if (!product.imageUrl) return 'Product image URL is required';
  if (!product.largeImageUrl) return 'Product large image URL is required';
  if (!product.productId)
    return 'Product ID is required';
  return null;
}
