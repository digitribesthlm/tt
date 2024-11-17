import { connectToDatabase } from '@/utils/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const { db } = await connectToDatabase();
        console.log('Connected to database');
        
        const products = await db.collection('products')
            .aggregate([
                {
                    $lookup: {
                        from: 'variants',
                        localField: '_id',
                        foreignField: 'product_id',
                        as: 'variants'
                    }
                },
                {
                    $lookup: {
                        from: 'images',
                        localField: '_id',
                        foreignField: 'product_id',
                        as: 'images'
                    }
                },
                {
                    $lookup: {
                        from: 'metadata',
                        localField: '_id',
                        foreignField: 'product_id',
                        as: 'metadata'
                    }
                },
                {
                    $lookup: {
                        from: 'sales',
                        localField: '_id',
                        foreignField: 'product_id',
                        as: 'sales'
                    }
                }
            ]).toArray();

        console.log('Found products:', products.length);
        return NextResponse.json(products);
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch products', details: error.message },
            { status: 500 }
        );
    }
} 