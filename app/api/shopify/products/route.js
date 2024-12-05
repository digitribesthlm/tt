import { shopifyFetch } from '@/utils/shopify';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        let allProducts = [];
        let nextPageUrl = 'products.json?limit=250';
        
        // Keep fetching until we have all products
        while (nextPageUrl) {
            const data = await shopifyFetch(nextPageUrl);
            
            if (!data || !data.products) {
                throw new Error('Invalid response from Shopify');
            }

            allProducts = [...allProducts, ...data.products];
            
            // Get the Link header from the response
            const linkHeader = data.headers?.get('Link');
            nextPageUrl = null;

            if (linkHeader) {
                const links = linkHeader.split(',');
                const nextLink = links.find(link => link.includes('rel="next"'));
                if (nextLink) {
                    const match = nextLink.match(/\<([^>]+)\>/);
                    if (match) {
                        // Extract just the path and query parameters from the full URL
                        const url = new URL(match[1]);
                        nextPageUrl = url.pathname.replace('/admin/api/', '') + url.search;
                    }
                }
            }
        }

        const products = allProducts.map(product => {
            const mainVariant = product.variants[0] || {};
            const mainImage = product.images[0] || {};
            
            return {
                id: product.id,
                title: product.title,
                body_html: product.body_html,
                vendor: product.vendor,
                product_type: product.product_type,
                created_at: product.created_at,
                handle: product.handle,
                updated_at: product.updated_at,
                published_at: product.published_at,
                template_suffix: product.template_suffix || null,
                published_scope: product.published_scope,
                tags: product.tags,
                status: product.status,
                admin_graphql_api_id: product.admin_graphql_api_id,
                
                // Variant details
                variant: {
                    id: mainVariant.id,
                    product_id: mainVariant.product_id,
                    title: mainVariant.title,
                    price: mainVariant.price,
                    sku: mainVariant.sku || null,
                    position: mainVariant.position,
                    inventory_policy: mainVariant.inventory_policy,
                    compare_at_price: mainVariant.compare_at_price,
                    inventory_management: mainVariant.inventory_management,
                    inventory_quantity: mainVariant.inventory_quantity,
                    old_inventory_quantity: mainVariant.old_inventory_quantity,
                    requires_shipping: mainVariant.requires_shipping,
                    taxable: mainVariant.taxable,
                    weight: mainVariant.weight,
                    weight_unit: mainVariant.weight_unit,
                    barcode: mainVariant.barcode || null
                },

                // Image details
                image: {
                    id: mainImage.id,
                    product_id: mainImage.product_id,
                    position: mainImage.position,
                    created_at: mainImage.created_at,
                    updated_at: mainImage.updated_at,
                    alt: mainImage.alt || null,
                    width: mainImage.width,
                    height: mainImage.height,
                    src: mainImage.src,
                    variant_ids: mainImage.variant_ids || [],
                    admin_graphql_api_id: mainImage.admin_graphql_api_id
                },

                // Full arrays if needed
                all_variants: product.variants,
                all_images: product.images,
                options: product.options
            };
        });

        return NextResponse.json(products);
    } catch (error) {
        console.error('Shopify API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch products', details: error.message },
            { status: 500 }
        );
    }
}