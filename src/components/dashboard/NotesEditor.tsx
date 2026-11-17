import { EditorContent, useEditor, useEditorState } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { usePreferencesStore } from '@/stores/preferencesStore';
import Card from '@/components/common/Card';

// Tiptap важкий, тому редактор підключається через lazy. Нотатки живуть лише в localStorage,
// на сервер не йдуть, а Tiptap сам відсікає HTML, якого немає в його схемі.
export default function NotesEditor() {
  const notes = usePreferencesStore((s) => s.notes);
  const setNotes = usePreferencesStore((s) => s.setNotes);

  const editor = useEditor({
    extensions: [StarterKit],
    content: notes,
    onUpdate: ({ editor }) => setNotes(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          'min-h-40 rounded-b-lg border border-gray-300 p-3 focus:outline-none dark:border-gray-600 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6',
        'aria-label': 'Нотатки',
      },
    },
  });

  // Без цього стан кнопок на панелі не оновлювався б при зміні виділення
  const active = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e?.isActive('bold') ?? false,
      italic: e?.isActive('italic') ?? false,
      bulletList: e?.isActive('bulletList') ?? false,
      orderedList: e?.isActive('orderedList') ?? false,
    }),
  });

  if (!editor) return null;

  const buttons = [
    {
      label: 'Ж',
      title: 'Жирний',
      on: active.bold,
      run: () => editor.chain().focus().toggleBold().run(),
    },
    {
      label: 'К',
      title: 'Курсив',
      on: active.italic,
      run: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      label: '• Список',
      title: 'Маркований список',
      on: active.bulletList,
      run: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      label: '1. Список',
      title: 'Нумерований список',
      on: active.orderedList,
      run: () => editor.chain().focus().toggleOrderedList().run(),
    },
  ];

  return (
    <Card>
      <h2 className="mb-1 text-xl font-semibold">Нотатки</h2>
      <p className="mb-4 text-sm text-gray-500">
        Наприклад, побажання до догляду за авто. Зберігаються на цьому пристрої.
      </p>
      <div className="flex flex-wrap gap-1 rounded-t-lg border border-b-0 border-gray-300 bg-gray-50 p-2 dark:border-gray-600 dark:bg-gray-800">
        {buttons.map((b) => (
          <button
            key={b.title}
            type="button"
            title={b.title}
            aria-label={b.title}
            aria-pressed={b.on}
            onClick={b.run}
            className={`rounded px-2.5 py-1 text-sm ${
              b.on ? 'bg-primary-600 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {b.label}
          </button>
        ))}
      </div>
      <EditorContent editor={editor} />
    </Card>
  );
}
