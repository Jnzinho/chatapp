import type { FieldError } from 'react-hook-form';

type Props = {
  label: string;
  error?: FieldError;
  children: React.ReactNode;
};

export function FormField({ label, error, children }: Props) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium tracking-wide text-ink-soft">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-[11px] font-medium text-error">{error.message}</p>
      )}
    </div>
  );
}
