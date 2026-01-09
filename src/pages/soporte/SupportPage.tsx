import { FormEvent, useState } from 'react';
import { FiClock, FiMapPin, FiShield, FiCheckCircle, FiTool, FiMessageCircle } from 'react-icons/fi';
import PreSaleSection from '../../components/support/PreSaleSection';
import PostSaleSection from '../../components/support/PostSaleSection';
import MaintenancePlans from '../../components/support/MaintenancePlans';
import SelectInput from '../../components/ui/SelectInput';
import { FadeIn } from '../../components/ui/FadeIn';
import TextInput from '../../components/ui/TextInput';
import Button from '../../components/ui/Button';
import { SupportRequest } from '../../features/support/types';
import { sendSupportRequest } from '../../features/support/supportApi';
import './SupportPage.css';

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
      <FadeIn direction="up">
        <header className="page__header support-hero">
          <div className="support-hero__copy">
            <span className="support-hero__eyebrow">Soporte especializado</span>
            <h1>Soporte</h1>
            <p>
              Servicios de pre y post venta para acompañar a tu laboratorio clínico con especialistas y
              servicio técnico propio.
            </p>
            <div className="support-hero__actions">
              <a className="btn btn-primary" href="#support-form">Solicitar soporte</a>
              <a className="btn btn-secondary" href="#support-plans">Ver planes</a>
            </div>
          </div>
          <div className="support-highlights">
            <div className="support-highlight">
              <FiClock size={20} />
              <div>
                <h3>Respuesta ágil</h3>
                <p>Priorizamos solicitudes críticas y coordinamos la visita técnica.</p>
              </div>
            </div>
            <div className="support-highlight">
              <FiMapPin size={20} />
              <div>
                <h3>Cobertura nacional</h3>
                <p>Atendemos en laboratorio y en terreno según necesidad.</p>
              </div>
            </div>
            <div className="support-highlight">
              <FiShield size={20} />
              <div>
                <h3>Equipo certificado</h3>
                <p>Técnicos capacitados para equipos y consumibles críticos.</p>
              </div>
            </div>
          </div>
        </header>
      </FadeIn>

      <FadeIn direction="up" delay={0.1}>
        <div className="support-service-grid">
          <div className="card support-service-card">
            <PreSaleSection />
          </div>
          <div className="card support-service-card">
            <PostSaleSection />
          </div>
          <div className="card support-service-card support-service-card--accent">
            <h2>Cómo trabajamos</h2>
            <ul>
              <li>
                <FiMessageCircle />
                Levantamiento de requerimiento y diagnóstico inicial.
              </li>
              <li>
                <FiTool />
                Coordinación de visita, repuestos y técnicos asignados.
              </li>
              <li>
                <FiCheckCircle />
                Cierre con informe y recomendaciones de continuidad.
              </li>
            </ul>
          </div>
        </div>
      </FadeIn>

      <FadeIn direction="up" delay={0.2}>
        <section id="support-plans" className="support-section">
          <MaintenancePlans />
        </section>
      </FadeIn>

      <FadeIn direction="up" delay={0.3}>
        <section id="support-form" className="support-section">
          <div className="support-form-grid">
            <div className="card support-form-card">
              <div className="support-form-header">
                <h2>Solicita soporte</h2>
                <p className="muted">
                  Completa tus datos y un especialista te contactará. Campos marcados como obligatorios se
                  validan en el frontend.
                </p>
              </div>
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
                <div className="support-form-actions">
                  <Button type="submit" disabled={submitting}>
                    {submitting ? 'Enviando...' : 'Enviar solicitud'}
                  </Button>
                  {success && <p className="success">Solicitud enviada (mock). Te contactaremos pronto.</p>}
                </div>
              </form>
            </div>
            <aside className="support-aside">
              <div className="card support-contact-card">
                <h3>Canales disponibles</h3>
                <ul>
                  <li>WhatsApp y teléfono para urgencias.</li>
                  <li>Correo y portal para seguimiento.</li>
                  <li>Visitas técnicas coordinadas.</li>
                </ul>
              </div>
              <div className="card support-contact-card">
                <h3>Antes de enviar</h3>
                <ul>
                  <li>Ten a mano modelo y número de serie.</li>
                  <li>Describe síntomas y mensajes de error.</li>
                  <li>Indica horario preferido de contacto.</li>
                </ul>
              </div>
            </aside>
          </div>
        </section>
      </FadeIn>
    </div>
  );
}

export default SupportPage;
