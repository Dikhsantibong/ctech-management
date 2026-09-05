import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath, MarkerType, type EdgeProps, type EdgeTypes } from '@xyflow/react';

function Labelled({ x, y, label }: { x: number; y: number; label?: string | null }) {
    if (!label) return null;
    return (
        <EdgeLabelRenderer>
            <div
                style={{ transform: `translate(-50%, -50%) translate(${x}px, ${y}px)` }}
                className="pointer-events-none absolute rounded border bg-card px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground shadow-sm"
            >
                {label}
            </div>
        </EdgeLabelRenderer>
    );
}

function FlowEdge({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, markerEnd, label }: EdgeProps) {
    const [path, labelX, labelY] = getSmoothStepPath({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, borderRadius: 8 });
    return (
        <>
            <BaseEdge path={path} markerEnd={markerEnd ?? `url(#arrow)`} style={{ stroke: 'var(--color-muted-foreground, #667085)', strokeWidth: 1.5 }} />
            <Labelled x={labelX} y={labelY} label={label as string} />
        </>
    );
}

function RelationshipEdge({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data, label }: EdgeProps) {
    const [path, labelX, labelY] = getSmoothStepPath({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, borderRadius: 8 });
    const card = (data?.cardinality as string) || (label as string) || '1:N';
    return (
        <>
            <BaseEdge path={path} style={{ stroke: '#155EEF', strokeWidth: 1.5 }} />
            <Labelled x={labelX} y={labelY} label={card} />
        </>
    );
}

export const edgeTypes: EdgeTypes = {
    flow: FlowEdge,
    relationship: RelationshipEdge,
};

export const defaultEdgeMarker = { type: MarkerType.ArrowClosed, width: 16, height: 16, color: '#667085' };
