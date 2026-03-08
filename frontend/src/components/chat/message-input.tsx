import { ArrowRight } from 'lucide-react';
import { useState, type FormEvent } from 'react';

type Props = {
  onSend: (content: string) => void;
};

export function MessageInput({ onSend }: Props) {
  const [text, setText] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText('');
  }

  return (
    <form onSubmit={handleSubmit} className="border-t border-line px-4 py-3 md:px-6 md:py-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
        placeholder="Digite sua mensagem aqui"
        rows={2}
        className="form-input resize-none"
      />
      <div className="mt-2 flex justify-end md:mt-3">
        <button
          type="submit"
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-ink transition-all hover:text-amber-deep"
        >
          Enviar <ArrowRight size={16} />
        </button>
      </div>
    </form>
  );
}
