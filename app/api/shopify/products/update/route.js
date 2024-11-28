import { shopifyFetch } from '@/utils/shopify';
import { NextResponse } from 'next/server';

export async function PUT(request) {
    try {
        const { productId, status } = await request.json();
        
        if (!productId || !status) {
            return NextResponse.json(
                { error: 'Product ID and status are required' },
                { status: 400 }
            );
        }

        console.log('Updating product:', { productId, status });

        // Update product in Shopify using admin API
        const response = await shopifyFetch(`admin/api/2023-10/products/${productId}.json`, {
            method: 'PUT',
            body: JSON.stringify({
                product: {
                    id: productId,
                    status: status
                }
            })
        });

        console.log('Shopify response:', response);

        if (!response.product) {
            throw new Error('Invalid response from Shopify');
        }

        return NextResponse.json(response.product);
    } catch (error) {
        console.error('Detailed Shopify API error:', {
            message: error.message,
            stack: error.stack,
            response: error.response
        });
        
        return NextResponse.json(
            { 
                error: 'Failed to update product', 
                details: error.message,
                response: error.response 
            },
            { status: 500 }
        );
    }
}
