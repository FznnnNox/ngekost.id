'use client';

import { Editor } from '@tinymce/tinymce-react';

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  return (
    <div className="overflow-hidden rounded-[14px]">
      <Editor
        tinymceScriptSrc="/tinymce/tinymce.min.js"
        licenseKey="gpl"
        value={value}
        onEditorChange={(html) => onChange(html)}
        init={{
          height: 360,
          menubar: false,
          placeholder: placeholder ?? 'Begin typing...',
          plugins: 'lists link image emoticons codesample',
          toolbar:
            'bold italic underline strikethrough codesample superscript subscript | ' +
            'blocks fontfamily fontsize | ' +
            'bullist numlist outdent indent | ' +
            'alignleft aligncenter alignright alignjustify | ' +
            'forecolor link image emoticons removeformat | undo redo',
          block_formats: 'Normal=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Quote=blockquote',
          font_size_formats: '10px 12px 14px 16px 18px 20px 24px 32px',
          font_family_formats:
            'Roboto=Roboto,sans-serif; Arial=arial,helvetica,sans-serif; ' +
            'Georgia=georgia,palatino,serif; Courier New=courier new,courier,monospace',
          content_style:
            "@import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap'); " +
            'body { font-family: Roboto, sans-serif; font-size: 16px; }',
          images_upload_handler: async (blobInfo) => {
            const formData = new FormData();
            formData.append('file', blobInfo.blob(), blobInfo.filename());
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            if (!res.ok) throw new Error('Upload gambar gagal');
            const { url } = await res.json();
            return url;
          },
        }}
      />
    </div>
  );
}