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

        // Update product in Shopify
        const response = await shopifyFetch(`products/${productId}.json`, {
            method: 'PUT',
            body: JSON.stringify({
                product: {
                    id: productId,
                    status: status
                }
            })
        });

        console.log('Raw Shopify response:', response);

        if (!response.data) {
            throw new Error('No data received from Shopify');
        }

        if (!response.data.product) {
            console.error('Invalid Shopify response:', response.data);
            throw new Error('Invalid product data received from Shopify');
        }

        // Log the updated product data
        console.log('Successfully updated product:', response.data.product);

        return NextResponse.json(response.data.product);
    } catch (error) {
        console.error('Detailed Shopify API error:', {
            message: error.message,
            stack: error.stack,
            response: error.response,
            data: error.response?.data
        });
        
        return NextResponse.json(
            { 
                error: error.message,
                details: error.response?.data || 'No additional details'
            },
            { status: error.status || 500 }
        );
    }
}
