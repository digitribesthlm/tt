import { connectToDatabase } from '@/utils/mongodb';
import { NextResponse } from 'next/server';

export async function PATCH(request, { params }) {
    try {
        const { id } = params;
        const { status } = await request.json();
        const { db } = await connectToDatabase();

        // Update the product status
        const result = await db.collection('products').updateOne(
            { internal_id: id },
            { 
                $set: {
                    status: status,
                    updated_at: new Date()
                }
            }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, status });
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json(
            { error: 'Failed to update product status' },
            { status: 500 }
        );
    }
} 