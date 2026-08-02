export function getCsrfToken() {
    const match = document.cookie.match(new RegExp('(^|;\\s*)XSRF-TOKEN=([^;]*)'));
    return match ? decodeURIComponent(match[2]) : null;
}

export async function apiFetch(url: string, options: RequestInit = {}) {
    // FormData harus dibiarkan tanpa Content-Type agar browser menulis boundary
    // multipart-nya sendiri; memaksa application/json membuat upload file gagal diparse.
    const isFormData = options.body instanceof FormData;

    const headers: Record<string, string> = {
        'Accept': 'application/json',
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...((options.headers as Record<string, string>) || {})
    };

    if (isFormData) {
        delete headers['Content-Type'];
    }

    const csrfToken = getCsrfToken();
    if (csrfToken && !['GET', 'HEAD', 'OPTIONS'].includes(options.method?.toUpperCase() || 'GET')) {
        headers['X-XSRF-TOKEN'] = csrfToken;
    }

    return fetch(url, {
        ...options,
        headers
    });
}
