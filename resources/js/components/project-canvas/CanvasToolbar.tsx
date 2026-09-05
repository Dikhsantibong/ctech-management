import { MousePointer2, Hand, Play, Square, Diamond, Octagon, Disc, Layers, Frame, StickyNote, Type, Spline, MoreHorizontal, Database, Box, Puzzle, AppWindow, FileText, Webhook, UserCog, Cloud } from 'lucide-react';
import { toast } from 'sonner';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

type Mode = 'select' | 'hand';

function Tool({ icon: Icon, label, active, onClick }: { icon: any; label: string; active?: boolean; onClick: () => void }) {
    return (
        <button
            type="button"
            title={label}
            onClick={onClick}
            className={`flex h-9 w-9 items-center justify-center rounded-md border text-muted-foreground transition-colors hover:bg-muted ${active ? 'border-primary bg-primary/10 text-primary' : 'border-transparent'}`}
        >
            <Icon className="h-[18px] w-[18px]" />
        </button>
    );
}

export function CanvasToolbar({ mode, onMode, onAdd }: { mode: Mode; onMode: (m: Mode) => void; onAdd: (type: string) => void }) {
    return (
        <div className="flex flex-col items-center gap-1 rounded-lg border bg-card p-1.5 shadow-sm">
            <Tool icon={MousePointer2} label="Select" active={mode === 'select'} onClick={() => onMode('select')} />
            <Tool icon={Hand} label="Hand (geser kanvas)" active={mode === 'hand'} onClick={() => onMode('hand')} />
            <div className="my-1 h-px w-6 bg-border" />
            <Tool icon={Play} label="Start" onClick={() => onAdd('start')} />
            <Tool icon={Square} label="Process" onClick={() => onAdd('process')} />
            <Tool icon={Diamond} label="Decision" onClick={() => onAdd('decision')} />
            <Tool icon={Octagon} label="End" onClick={() => onAdd('end')} />
            <Tool icon={Disc} label="Data" onClick={() => onAdd('data')} />
            <Tool icon={Layers} label="Subprocess" onClick={() => onAdd('subprocess')} />
            <div className="my-1 h-px w-6 bg-border" />
            <Tool icon={Frame} label="Section" onClick={() => onAdd('section')} />
            <Tool icon={StickyNote} label="Note" onClick={() => onAdd('note')} />
            <Tool icon={Type} label="Text" onClick={() => onAdd('text')} />
            <Tool icon={Spline} label="Connector" onClick={() => toast.info('Tarik dari titik biru di tepi node untuk menghubungkan.')} />
            <div className="my-1 h-px w-6 bg-border" />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button type="button" title="Lainnya" className="flex h-9 w-9 items-center justify-center rounded-md border border-transparent text-muted-foreground hover:bg-muted">
                        <MoreHorizontal className="h-[18px] w-[18px]" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" align="start">
                    <DropdownMenuLabel>ERD</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onAdd('database')}><Database className="mr-2 h-4 w-4" /> Database Table</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Application Object</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onAdd('module')}><Box className="mr-2 h-4 w-4" /> Module</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onAdd('feature')}><Puzzle className="mr-2 h-4 w-4" /> Feature</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onAdd('application')}><AppWindow className="mr-2 h-4 w-4" /> Application</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onAdd('page')}><FileText className="mr-2 h-4 w-4" /> Page</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onAdd('api')}><Webhook className="mr-2 h-4 w-4" /> API</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onAdd('userRole')}><UserCog className="mr-2 h-4 w-4" /> User Role</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onAdd('externalService')}><Cloud className="mr-2 h-4 w-4" /> External Service</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
