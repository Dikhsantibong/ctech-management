import type { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon({ className, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <>
            <img src="/letter/main-logo.png" alt="CTECH Logo Light" className={`${className || ''} block dark:hidden`} {...props} />
            <img src="/logo/sidebar-logo.png" alt="CTECH Logo Dark" className={`${className || ''} hidden dark:block`} {...props} />
        </>
    );
}
