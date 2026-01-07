import { FormEvent, useState } from 'react';
import PreSaleSection from '../../components/support/PreSaleSection';
import PostSaleSection from '../../components/support/PostSaleSection';
import MaintenancePlans from '../../components/support/MaintenancePlans';
import SelectInput from '../../components/ui/SelectInput';
import TextInput from '../../components/ui/TextInput';
import Button from '../../components/ui/Button';
import { SupportRequest } from '../../features/support/types';
import { sendSupportRequest } from '../../features/support/supportApi';

// Página de soporte con bloques de servicio y formulario validado (mock).
function SupportPage() {
  const [form, setForm] = useState<SupportRequest>({
    type: '',
    name: '',
    organization: '',
    email: '',
    phone: '',
    comment: '',
    equipment: '',
    serial: ''
  });
  const [errors, setErrors] = useState<Partial<Record<keyof SupportRequest, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const next: Partial<Record<keyof SupportRequest, string>> = {};
    if (!form.type) next.type = 'Selecciona un tipo de servicio';
    if (!form.name.trim()) next.name = 'Ingresa tu nombre';
    if (!form.organization.trim()) next.organization = 'Ingresa tu laboratorio o institución';
    if (!form.email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      next.email = 'Email inválido';
    }
    if (!form.comment.trim()) next.comment = 'Describe tu solicitud';
    if (!form.equipment.trim()) next.equipment = 'Indica el equipo o solución';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setSuccess(false);
    // Simula una espera de red para UX.
    await new Promise((resolve) => setTimeout(resolve, 800));
    // TODO: reemplazar por llamada real al backend (supportApi.sendSupportRequest).
    await sendSupportRequest(form);
    setSubmitting(false);
    setSuccess(true);
    setForm({
      type: '',
      name: '',
      organization: '',
      email: '',
      phone: '',
      comment: '',
      equipment: '',
      serial: ''
    });
  };

  return (
    <div className="page">
      <header className="page__header">
        <h1>Soporte</h1>
        <p>
          Servicios de pre y post venta para acompañar a tu laboratorio clínico con especialistas y
          servicio técnico propio.
        </p>
      </header>

      <div className="grid two">
        <PreSaleSection />
        <PostSaleSection />
      </div>

      <MaintenancePlans />

      <section>
        <h2>Solicita soporte</h2>
        <p className="muted">
          Completa tus datos y un especialista te contactará. Campos marcados como obligatorios se
          validan en el frontend.
        </p>
        <form className="form" onSubmit={handleSubmit}>
          <SelectInput
            id="support-type"
            label="Tipo de consulta"
            required
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value as SupportRequest['type'] })}
            options={[
              { value: 'preventa', label: 'Consulta pre venta' },
              { value: 'demostracion', label: 'Solicitud de demostración' },
              { value: 'problema_tecnico', label: 'Problema técnico' },
              { value: 'mantenimiento_preventivo', label: 'Mantenimiento preventivo' },
              { value: 'otro', label: 'Otro' }
            ]}
            error={errors.type}
          />
          <TextInput
            id="support-name"
            label="Nombre"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            error={errors.name}
          />
          <TextInput
            id="support-organization"
            label="Laboratorio/Institución"
            required
            value={form.organization}
            onChange={(e) => setForm({ ...form, organization: e.target.value })}
            error={errors.organization}
          />
          <TextInput
            id="support-email"
            label="Email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            error={errors.email}
          />
          <TextInput
            id="support-phone"
            label="Teléfono (opcional)"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <div className="form-control">
            <label htmlFor="support-equipment">Equipo</label>
            <input
              id="support-equipment"
              value={form.equipment}
              onChange={(e) => setForm({ ...form, equipment: e.target.value })}
              required
            />
            {errors.equipment && <p className="form-error">{errors.equipment}</p>}
          </div>
          <div className="form-control">
            <label htmlFor="support-serial">Número de serie (opcional)</label>
            <input
              id="support-serial"
              value={form.serial}
              onChange={(e) => setForm({ ...form, serial: e.target.value })}
            />
          </div>
          <div className="form-control">
            <label htmlFor="support-comment">Descripción</label>
            <textarea
              id="support-comment"
              value={form.comment}
              required
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
            />
            {errors.comment && <p className="form-error">{errors.comment}</p>}
          </div>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Enviando...' : 'Enviar solicitud'}
          </Button>
          {success && <p className="success">Solicitud enviada (mock). Te contactaremos pronto.</p>}
        </form>
      </section>
    </div>
  );
}

export default SupportPage;
