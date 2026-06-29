import { Head } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';

interface SEOProps {
    title: string;
    description: string;
    image?: string;
    url?: string;
}

export function SEO({ title, description, image = '/logo/logo-web.png', url }: SEOProps) {
    const defaultDomain = 'https://ctechcreative.com';
    const canonicalUrl = url ? `${defaultDomain}${url}` : defaultDomain;
    const imageUrl = image.startsWith('http') ? image : `${defaultDomain}${image}`;

    return (
        <Head>
            <title>{title}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={canonicalUrl} />

            {/* OpenGraph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={imageUrl} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={canonicalUrl} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={imageUrl} />
        </Head>
    );
}
