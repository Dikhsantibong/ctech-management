import LetterEditorTiptap from './letter-editor-tiptap';

export default function LetterEditor({
    value,
    onChange,
    className,
}: {
    value: string;
    onChange: (value: string) => void;
    className?: string;
}) {
    return (
        <LetterEditorTiptap
            value={value}
            onChange={onChange}
            className={className}
        />
    );
}
