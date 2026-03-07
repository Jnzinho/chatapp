import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { MessageCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { FormField } from '#/components/ui/form-field';
import { useAuth } from '#/contexts/auth';
import { loginSchema, type LoginFormData } from '#/lib/schemas';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  function onSubmit(data: LoginFormData) {
    setServerError('');
    const success = login(data.email, data.password);
    if (success) {
      navigate({ to: '/chat' });
    } else {
      setServerError('Email não encontrado. Tente com um email cadastrado.');
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4">
      <div className="glass-panel animate-slide-up w-full max-w-[380px] rounded-3xl p-8">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--amber)] to-[var(--amber-deep)] shadow-md">
            <MessageCircle size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold tracking-tight text-[var(--ink)]">
              Entrar
            </h1>
            <p className="text-xs text-[var(--ink-muted)]">
              Acesse o chat com sua conta
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Email" error={errors.email}>
            <input
              {...register('email')}
              type="email"
              placeholder="seu@email.com"
              className={`form-input ${errors.email ? 'form-input-error' : ''}`}
            />
          </FormField>

          <FormField label="Senha" error={errors.password}>
            <input
              {...register('password')}
              type="password"
              placeholder="••••••••"
              className={`form-input ${
                errors.password ? 'form-input-error' : ''
              }`}
            />
          </FormField>

          {serverError && (
            <p className="rounded-lg bg-[rgba(232,84,84,0.08)] px-3 py-2 text-xs font-medium text-[var(--error)]">
              {serverError}
            </p>
          )}

          <button type="submit" disabled={isSubmitting} className="btn-primary">
            Entrar
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-[var(--ink-muted)]">
          Não tem conta?{' '}
          <Link
            to="/register"
            className="font-semibold text-[var(--amber-deep)] no-underline transition-colors hover:text-[var(--amber)]"
          >
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}
