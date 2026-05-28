import type { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img src="/logo/sidebar-logo.png" alt="CTECH Logo" {...props} />
    );
}
