import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const modules = {
    toolbar: [
        [{ font: [] }, { size: ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ color: [] }, { background: [] }],
        [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }],
        ['clean'],
    ],
};

const formats = [
    'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'align', 'list', 'indent',
];

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
        <div className={className}>
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                formats={formats}
                className="bg-background [&_.ql-container]:min-h-[280px] [&_.ql-container]:font-serif [&_.ql-container]:text-sm [&_.ql-editor]:min-h-[280px]"
            />
        </div>
    );
}
