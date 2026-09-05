/**
 * Helper & registry bersama untuk Project Canvas (React Flow / @xyflow/react).
 * Definisi tipe node, data default, dan util persistensi terpusat di sini.
 */

export interface CanvasColumn {
    name: string;
    type?: string;
    key?: string;
    pk?: boolean;
    fk?: boolean;
}

export interface CanvasNodeData {
    label?: string;
    description?: string;
    module?: string;
    feature?: string;
    status?: string;
    pic?: string;
    notes?: string;
    route?: string;
    repository?: string;
    documentation?: string;
    objectKind?: string;
    columns?: CanvasColumn[];
    source_type?: string;
    source_reference?: string;
    [key: string]: unknown;
}

export type CanvasCategory = 'flow' | 'structure' | 'app' | 'erd';

interface NodeDef {
    key: string;
    label: string;
    category: CanvasCategory;
    /** Ukuran default node saat dibuat. */
    defaultData: CanvasNodeData;
}

/** Registry seluruh jenis node yang didukung V1. */
export const NODE_DEFS: Record<string, NodeDef> = {
    start: { key: 'start', label: 'Start', category: 'flow', defaultData: { label: 'Mulai' } },
    process: { key: 'process', label: 'Process', category: 'flow', defaultData: { label: 'Proses' } },
    decision: { key: 'decision', label: 'Decision', category: 'flow', defaultData: { label: 'Keputusan?' } },
    end: { key: 'end', label: 'End', category: 'flow', defaultData: { label: 'Selesai' } },
    data: { key: 'data', label: 'Data', category: 'flow', defaultData: { label: 'Data' } },
    subprocess: { key: 'subprocess', label: 'Subprocess', category: 'flow', defaultData: { label: 'Subproses' } },
    section: { key: 'section', label: 'Section', category: 'structure', defaultData: { label: 'SECTION' } },
    note: { key: 'note', label: 'Note', category: 'structure', defaultData: { label: 'Catatan...' } },
    text: { key: 'text', label: 'Text', category: 'structure', defaultData: { label: 'Teks' } },
    database: { key: 'database', label: 'Database Table', category: 'erd', defaultData: { label: 'table_name', columns: [{ name: 'id', type: 'bigint', key: 'PK', pk: true }] } },
    module: { key: 'module', label: 'Module', category: 'app', defaultData: { label: 'Module', objectKind: 'Module' } },
    feature: { key: 'feature', label: 'Feature', category: 'app', defaultData: { label: 'Feature', objectKind: 'Feature' } },
    application: { key: 'application', label: 'Application', category: 'app', defaultData: { label: 'Application', objectKind: 'Application' } },
    page: { key: 'page', label: 'Page', category: 'app', defaultData: { label: 'Page', objectKind: 'Page' } },
    api: { key: 'api', label: 'API', category: 'app', defaultData: { label: 'API Endpoint', objectKind: 'API' } },
    userRole: { key: 'userRole', label: 'User Role', category: 'app', defaultData: { label: 'User Role', objectKind: 'User Role' } },
    externalService: { key: 'externalService', label: 'External Service', category: 'app', defaultData: { label: 'External Service', objectKind: 'External Service' } },
};

export const STATUS_OPTIONS = ['Planning', 'Development', 'Testing', 'Done', 'On Hold'];

let counter = 0;
/** ID node/edge unik & stabil untuk satu sesi (dipakai sebagai node_key/edge_key). */
export function newId(prefix = 'n'): string {
    counter += 1;
    return `${prefix}_${Date.now().toString(36)}_${counter}`;
}

function getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^|;\\s*)' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[2]) : null;
}

/**
 * fetch dengan header CSRF Laravel (XSRF-TOKEN). Dipakai untuk autosave & aksi
 * canvas agar tidak memicu reload Inertia penuh (menjaga state editor & performa).
 */
export async function csrfFetch(url: string, options: { method: string; body?: unknown }): Promise<Response> {
    const token = getCookie('XSRF-TOKEN');
    return fetch(url, {
        method: options.method,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            ...(token ? { 'X-XSRF-TOKEN': token } : {}),
        },
        credentials: 'same-origin',
        body: options.body ? JSON.stringify(options.body) : undefined,
    });
}
