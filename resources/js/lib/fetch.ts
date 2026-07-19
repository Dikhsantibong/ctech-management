export function getCsrfToken() {
    const match = document.cookie.match(new RegExp('(^|;\\s*)XSRF-TOKEN=([^;]*)'));
    return match ? decodeURIComponent(match[2]) : null;
}

export async function apiFetch(url: string, options: RequestInit = {}) {
    const headers: Record<string, string> = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...((options.headers as Record<string, string>) || {})
    };

    const csrfToken = getCsrfToken();
    if (csrfToken && !['GET', 'HEAD', 'OPTIONS'].includes(options.method?.toUpperCase() || 'GET')) {
        headers['X-XSRF-TOKEN'] = csrfToken;
    }

    return fetch(url, {
        ...options,
        headers
    });
}
