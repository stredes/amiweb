import { FormEvent, useEffect, useRef, useState } from 'react';
import TextInput from '../ui/TextInput';
import Button from '../ui/Button';
import { sendContactMessage } from '../../features/contact/contactApi';
import { ContactMessage } from '../../features/contact/types';

type ContactFormData = {
  name: string;
  email: string;
  confirmEmail: string;
  message: string;
};

function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    confirmEmail: '',
    message: ''
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (Object.keys(errors).length === 0) return;
    const firstInvalid = formRef.current?.querySelector<HTMLElement>('[aria-invalid=\"true\"]');
    firstInvalid?.focus();
  }, [errors]);

  const validate = () => {
    const next: Partial<Record<keyof ContactFormData, string>> = {};
    if (!formData.name.trim()) next.name = 'Ingresa tu nombre';
    if (!formData.email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) {
      next.email = 'Email inválido';
    }
    if (formData.confirmEmail !== formData.email) {
      next.confirmEmail = 'Los correos no coinciden';
    }
    if (!formData.message.trim()) next.message = 'Ingresa un mensaje';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setSuccess(false);
    const payload: ContactMessage = { ...formData };
    // TODO: enviar mensaje al backend mediante contactApi.sendContactMessage
    await new Promise((resolve) => setTimeout(resolve, 600));
    await sendContactMessage(payload);
    setSubmitting(false);
    setSuccess(true);
    setFormData({ name: '', email: '', confirmEmail: '', message: '' });
  };

  return (
    <form className="form" onSubmit={handleSubmit} ref={formRef} noValidate>
      <TextInput
        id="contact-name"
        label="Nombre"
        required
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        error={errors.name}
        autoComplete="name"
        name="name"
      />
      <TextInput
        id="contact-email"
        label="Email"
        type="email"
        required
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        error={errors.email}
        autoComplete="email"
        name="email"
        inputMode="email"
        spellCheck={false}
      />
      <TextInput
        id="contact-confirm-email"
        label="Confirmar email"
        type="email"
        required
        value={formData.confirmEmail}
        onChange={(e) => setFormData({ ...formData, confirmEmail: e.target.value })}
        error={errors.confirmEmail}
        autoComplete="email"
        name="confirmEmail"
        inputMode="email"
        spellCheck={false}
      />
      <div className="form-control">
        <label htmlFor="contact-message">Mensaje</label>
        <textarea
          id="contact-message"
          required
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
          name="message"
        />
        {errors.message && (
          <p id="contact-message-error" className="form-error" role="alert">
            {errors.message}
          </p>
        )}
      </div>
      <Button type="submit" disabled={submitting}>
        {submitting ? 'Enviando…' : 'Enviar mensaje'}
      </Button>
      {success && (
        <p className="success" role="status">
          Mensaje enviado (mock). Gracias por contactarnos.
        </p>
      )}
    </form>
  );
}

export default ContactForm;
