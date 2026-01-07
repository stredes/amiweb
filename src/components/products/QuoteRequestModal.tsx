import { FormEvent, useState } from 'react';
import Button from '../ui/Button';
import TextInput from '../ui/TextInput';
import { Product } from '../../features/catalog/types';

type QuoteRequestModalProps = {
  product: Product | null;
  onClose: () => void;
};

type QuoteForm = {
  name: string;
  organization: string;
  email: string;
  phone: string;
  comment: string;
};

type QuoteFormErrors = Partial<Record<keyof QuoteForm, string>>;

// Modal simple para solicitar cotización. Usa estado local y mock de envío.
function QuoteRequestModal({ product, onClose }: QuoteRequestModalProps) {
  const [form, setForm] = useState<QuoteForm>({
    name: '',
    organization: '',
    email: '',
    phone: '',
    comment: ''
  });
  const [errors, setErrors] = useState<QuoteFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!product) return null;

  const validate = (): boolean => {
    const nextErrors: QuoteFormErrors = {};
    if (!form.name.trim()) nextErrors.name = 'Ingresa tu nombre';
    if (!form.organization.trim()) nextErrors.organization = 'Ingresa tu laboratorio o institución';
    if (!form.email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email))
      nextErrors.email = 'Email inválido';
    if (!form.comment.trim()) nextErrors.comment = 'Describe tu necesidad';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setSuccess(false);
    // TODO: reemplazar por llamada real a backend para crear solicitud de cotización.
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSubmitting(false);
    setSuccess(true);
    setForm({ name: '', organization: '', email: '', phone: '', comment: '' });
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <div className="modal__header">
          <div>
            <p className="badge">Cotización</p>
            <h3>{product.name}</h3>
            <p className="muted">{product.brand}</p>
          </div>
          <button className="modal__close" onClick={onClose} aria-label="Cerrar">
            ×
          </button>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <TextInput
            id="quote-name"
            label="Nombre"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            error={errors.name}
          />
          <TextInput
            id="quote-organization"
            label="Laboratorio/Institución"
            required
            value={form.organization}
            onChange={(e) => setForm({ ...form, organization: e.target.value })}
            error={errors.organization}
          />
          <TextInput
            id="quote-email"
            label="Email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            error={errors.email}
          />
          <TextInput
            id="quote-phone"
            label="Teléfono (opcional)"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <div className="form-control">
            <label htmlFor="quote-comment">Comentario</label>
            <textarea
              id="quote-comment"
              required
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
            />
            {errors.comment && <p className="form-error">{errors.comment}</p>}
          </div>
          <div className="card__actions">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Enviando...' : 'Enviar cotización'}
            </Button>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
          </div>
          {success && (
            <p className="success">
              Solicitud enviada (mock). Un ejecutivo de AMILAB te contactará.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default QuoteRequestModal;
