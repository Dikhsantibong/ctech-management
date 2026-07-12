import { useEffect, useRef } from 'react';

const VERTEX_SHADER = `
attribute vec2 a_position;
void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

// Abstract liquid streaks: 2D simplex noise + fbm + domain warping,
// bergerak diagonal perlahan di atas dasar gelap.
const FRAGMENT_SHADER = `
precision highp float;
uniform float u_time;
uniform vec2 u_resolution;

vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float noise(in vec2 p) {
    const float K1 = 0.366025404;
    const float K2 = 0.211324865;
    vec2 i = floor(p + (p.x + p.y) * K1);
    vec2 a = p - i + (i.x + i.y) * K2;
    vec2 o = (a.x > a.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec2 b = a - o + K2;
    vec2 c = a - 1.0 + 2.0 * K2;
    vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
    vec3 n = h * h * h * h * vec3(dot(a, hash(i + 0.0)), dot(b, hash(i + o)), dot(c, hash(i + 1.0)));
    return dot(n, vec3(70.0));
}

float fbm(vec2 p) {
    float f = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 5; i++) {
        f += amp * noise(p);
        p *= 2.02;
        amp *= 0.5;
    }
    return f;
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 p = uv * vec2(u_resolution.x / u_resolution.y, 1.0);
    float t = u_time * 0.08;
    vec2 drift = vec2(t * 0.6, t * 0.35);

    vec2 q = vec2(fbm(p * 1.4 + drift), fbm(p * 1.4 + drift + vec2(5.2, 1.3)));
    vec2 r = vec2(
        fbm(p * 1.4 + q * 1.8 + vec2(1.7, 9.2) + t * 0.3),
        fbm(p * 1.4 + q * 1.8 + vec2(8.3, 2.8) - t * 0.2)
    );
    float f = fbm(p * 1.4 + r * 1.6);

    vec3 col = mix(vec3(0.04, 0.04, 0.06), vec3(0.12, 0.15, 0.22), clamp(f * f * 2.4, 0.0, 1.0));
    float streak = smoothstep(0.35, 0.9, fbm(p * vec2(2.2, 0.6) + r * 1.2 + drift));
    col = mix(col, vec3(0.35, 0.35, 0.4), streak * 0.35 * clamp(q.x + 0.5, 0.0, 1.0));

    float vig = smoothstep(1.2, 0.35, length(uv - 0.5));
    col *= mix(0.75, 1.0, vig);

    gl_FragColor = vec4(col, 1.0);
}
`;

/**
 * Background hero WebGL tanpa dependency tambahan.
 * Render dijeda otomatis saat canvas keluar viewport (IntersectionObserver),
 * DPR dibatasi maksimal 2 agar hemat di layar retina.
 */
export function HeroShaderCanvas({ className = '' }: { className?: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext('webgl', { antialias: false, alpha: false });
        if (!gl) return; // fallback: latar dark solid dari CSS

        function compile(type: number, source: string) {
            const shader = gl!.createShader(type);
            if (!shader) return null;
            gl!.shaderSource(shader, source);
            gl!.compileShader(shader);
            if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
                gl!.deleteShader(shader);
                return null;
            }
            return shader;
        }

        const vs = compile(gl.VERTEX_SHADER, VERTEX_SHADER);
        const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
        if (!vs || !fs) return;

        const program = gl.createProgram();
        if (!program) return;
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
        gl.useProgram(program);

        // Fullscreen triangle
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
        const aPosition = gl.getAttribLocation(program, 'a_position');
        gl.enableVertexAttribArray(aPosition);
        gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

        const uTime = gl.getUniformLocation(program, 'u_time');
        const uResolution = gl.getUniformLocation(program, 'u_resolution');

        function resize() {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const width = Math.floor(canvas!.clientWidth * dpr);
            const height = Math.floor(canvas!.clientHeight * dpr);
            if (canvas!.width !== width || canvas!.height !== height) {
                canvas!.width = width;
                canvas!.height = height;
                gl!.viewport(0, 0, width, height);
            }
        }

        let rafId = 0;
        let visible = true;
        const start = performance.now();

        function render(now: number) {
            if (!visible) return;
            resize();
            gl!.uniform1f(uTime, (now - start) / 1000);
            gl!.uniform2f(uResolution, canvas!.width, canvas!.height);
            gl!.drawArrays(gl!.TRIANGLES, 0, 3);
            rafId = requestAnimationFrame(render);
        }

        const observer = new IntersectionObserver(([entry]) => {
            const wasVisible = visible;
            visible = entry.isIntersecting;
            if (visible && !wasVisible) {
                rafId = requestAnimationFrame(render);
            } else if (!visible) {
                cancelAnimationFrame(rafId);
            }
        });
        observer.observe(canvas);

        window.addEventListener('resize', resize);
        rafId = requestAnimationFrame(render);

        return () => {
            observer.disconnect();
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(rafId);
            gl.getExtension('WEBGL_lose_context')?.loseContext();
        };
    }, []);

    return <canvas ref={canvasRef} className={`h-full w-full ${className}`} aria-hidden="true" />;
}
