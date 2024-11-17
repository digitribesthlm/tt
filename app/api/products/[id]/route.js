import { connectToDatabase } from '@/utils/mongodb';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    try {
        const { id } = params;
        const { db } = await connectToDatabase();
        
        const product = await db.collection('products')
            .aggregate([
                {
                    $match: { internal_id: id }
                },
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
                }
            ]).next();

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch product' },
            { status: 500 }
        );
    }
}

export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const updateData = await request.json();
        const { db } = await connectToDatabase();

        // Update the main product document
        const result = await db.collection('products').updateOne(
            { internal_id: id },
            { 
                $set: {
                    title: updateData.title,
                    description: updateData.description,
                    category: updateData.category,
                    style: updateData.style,
                    status: updateData.status,
                    is_unique: updateData.is_unique,
                    updated_at: new Date()
                }
            }
        );

        // Update variants
        for (const variant of updateData.variants) {
            await db.collection('variants').updateOne(
                { _id: variant._id },
                {
                    $set: {
                        title: variant.title,
                        price: variant.price,
                        inventory_quantity: variant.inventory_quantity,
                        updated_at: new Date()
                    }
                }
            );
        }

        // Update metadata
        await db.collection('metadata').updateOne(
            { product_id: id },
            {
                $set: {
                    tattoo_details: updateData.metadata.tattoo_details,
                    artist_notes: updateData.metadata.artist_notes,
                    care_instructions: updateData.metadata.care_instructions,
                    updated_at: new Date()
                }
            }
        );

        // Fetch and return the updated product
        const updatedProduct = await db.collection('products')
            .aggregate([
                {
                    $match: { internal_id: id }
                },
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
                }
            ]).next();

        return NextResponse.json(updatedProduct);
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json(
            { error: 'Failed to update product' },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = params;
        const { db } = await connectToDatabase();

        // Start a session for transaction
        const session = db.client.startSession();

        try {
            await session.withTransaction(async () => {
                // Get the product to find its ID for related collections
                const product = await db.collection('products').findOne({ internal_id: id });
                
                if (!product) {
                    throw new Error('Product not found');
                }

                // Delete related records
                await db.collection('variants').deleteMany({ product_id: product._id });
                await db.collection('images').deleteMany({ product_id: product._id });
                await db.collection('metadata').deleteMany({ product_id: product._id });
                await db.collection('sales').deleteMany({ product_id: product._id });

                // Delete the product itself
                await db.collection('products').deleteOne({ internal_id: id });
            });

            await session.endSession();
            return NextResponse.json({ success: true });

        } catch (error) {
            await session.endSession();
            throw error;
        }

    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json(
            { error: 'Failed to delete product' },
            { status: 500 }
        );
    }
} 