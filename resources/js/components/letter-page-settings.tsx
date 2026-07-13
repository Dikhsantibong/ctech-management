import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Pengaturan halaman PDF per surat: margin (mm) dan spasi baris
export default function LetterPageSettings({
    data,
    setData,
}: {
    data: {
        margin_top: number;
        margin_right: number;
        margin_bottom: number;
        margin_left: number;
        line_spacing: string;
    };
    setData: (key: any, value: any) => void;
}) {
    const marginField = (key: 'margin_top' | 'margin_right' | 'margin_bottom' | 'margin_left', label: string) => (
        <div className="space-y-1">
            <Label htmlFor={key} className="text-xs text-muted-foreground">{label}</Label>
            <Input
                id={key}
                type="number"
                min={5}
                max={60}
                value={data[key]}
                onChange={e => setData(key, parseInt(e.target.value) || 0)}
            />
        </div>
    );

    return (
        <div className="space-y-3 rounded-md border p-3">
            <p className="text-sm font-medium">Pengaturan Halaman PDF</p>
            <div className="grid grid-cols-4 gap-2">
                {marginField('margin_top', 'Atas (mm)')}
                {marginField('margin_bottom', 'Bawah (mm)')}
                {marginField('margin_left', 'Kiri (mm)')}
                {marginField('margin_right', 'Kanan (mm)')}
            </div>
            <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Spasi Baris</Label>
                <Select value={data.line_spacing} onValueChange={v => setData('line_spacing', v)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Spasi" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1">Tunggal (1)</SelectItem>
                        <SelectItem value="1.15">1,15</SelectItem>
                        <SelectItem value="1.5">1,5</SelectItem>
                        <SelectItem value="2">Ganda (2)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
