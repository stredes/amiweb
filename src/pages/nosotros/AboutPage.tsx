import { useState } from 'react';
import TextType from '../../components/ui/TextType';
import { FadeIn } from '../../components/ui/FadeIn';
import './AboutPage.css';

interface TeamMember {
  name: string;
  role: string;
  description: string;
  icon: string;
}

interface Brand {
  name: string;
  category: string;
  description: string;
}

function AboutPage() {
  const [activeTab, setActiveTab] = useState<'mision' | 'vision' | 'valores'>('mision');
  const [brandIndex, setBrandIndex] = useState(0);

  const teamMembers: TeamMember[] = [
    {
      name: "Atención Clínica",
      role: "Venta consultiva",
      description: "Odontólogos y especialistas que orientan la elección de cada solución",
      icon: "👥"
    },
    {
      name: "Servicio Técnico",
      role: "Instalación y mantenimiento",
      description: "Técnicos certificados para instalación, calibración y reparación",
      icon: "🔧"
    },
    {
      name: "Logística",
      role: "Distribución",
      description: "Despachos rápidos a todo Chile con control de stock",
      icon: "🚛"
    },
    {
      name: "Formación",
      role: "Actualización continua",
      description: "Talleres clínicos, lanzamientos y soporte en nuevas tecnologías",
      icon: "📚"
    }
  ];

  const brands: Brand[] = [
    {
      name: "FGM Dental Group",
      category: "Estética y blanqueamiento",
      description: "Referente internacional en estética dental"
    },
    {
      name: "Wisedent",
      category: "Odontología restauradora",
      description: "Materiales clínicos de alta precisión"
    },
    {
      name: "Dimed",
      category: "Insumos de alta rotación",
      description: "Portafolio completo para la práctica diaria"
    },
    {
      name: "SMI",
      category: "Cirugía y suturas",
      description: "Soluciones quirúrgicas confiables"
    },
    {
      name: "Acteon",
      category: "Equipos e imagenología",
      description: "Tecnología avanzada para diagnóstico y tratamiento"
    }
  ];
  const maxBrandIndex = Math.max(0, brands.length - 3);

  const handlePrevBrands = () => setBrandIndex((prev) => Math.max(0, prev - 1));
  const handleNextBrands = () => setBrandIndex((prev) => Math.min(maxBrandIndex, prev + 1));

  const achievements = [
    { number: "Consultivo", label: "Equipo clínico especializado", icon: "📅" },
    { number: "Nacional", label: "Cobertura y logística", icon: "🏥" },
    { number: "Academia", label: "Formación continua", icon: "⭐" },
    { number: "Soporte", label: "Servicio técnico", icon: "🔧" }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <FadeIn direction="up">
          <div className="about-hero-content">
            <h1 className="about-title">SP Dental</h1>
            <p className="about-subtitle">Soluciones integrales para clínicas dentales</p>
            <div className="about-hero-description">
              <p>
                Somos una empresa chilena especializada en insumos, equipamiento y soluciones
                tecnológicas para odontología. Nos enfocamos en la venta consultiva, el soporte
                técnico certificado y la capacitación continua para clínicas y profesionales.
              </p>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Achievements Section */}
      <FadeIn direction="up" delay={0.1}>
        <section className="about-achievements">
          <div className="achievements-grid">
            {achievements.map((achievement, index) => (
              <div key={index} className="achievement-card">
                <div className="achievement-icon">{achievement.icon}</div>
                <div className="achievement-number">{achievement.number}</div>
                <div className="achievement-label">{achievement.label}</div>
              </div>
            ))}
          </div>
        </section>
      </FadeIn>

      {/* Mission, Vision, Values */}
      <FadeIn direction="up" delay={0.2}>
        <section className="about-mvv">
          <div className="mvv-tabs">
            <button
              className={`mvv-tab ${activeTab === 'mision' ? 'active' : ''}`}
              onClick={() => setActiveTab('mision')}
            >
              Misión
            </button>
            <button
              className={`mvv-tab ${activeTab === 'vision' ? 'active' : ''}`}
              onClick={() => setActiveTab('vision')}
            >
              Visión
            </button>
            <button
              className={`mvv-tab ${activeTab === 'valores' ? 'active' : ''}`}
              onClick={() => setActiveTab('valores')}
            >
              Valores
            </button>
          </div>
          
          <div className="mvv-content">
            {activeTab === 'mision' && (
              <div className="mvv-panel">
                <h3>Nuestra Misión</h3>
                <p>
                  Proveer soluciones integrales para clínicas dentales, garantizando
                  disponibilidad de insumos y equipamiento de calidad, respaldados por
                  soporte técnico especializado y acompañamiento clínico.
                </p>
              </div>
            )}
            
            {activeTab === 'vision' && (
              <div className="mvv-panel">
                <h3>Nuestra Visión</h3>
                <p>
                  Ser reconocidos como el socio estratégico de referencia para clínicas
                  dentales en Chile, destacando por excelencia en servicio, innovación
                  tecnológica y compromiso con la calidad clínica.
                </p>
              </div>
            )}
            
            {activeTab === 'valores' && (
              <div className="mvv-panel">
                <h3>Nuestros Valores</h3>
                <ul className="values-list">
                  <li><strong>Excelencia:</strong> Compromiso con la calidad clínica en cada solución</li>
                  <li><strong>Confiabilidad:</strong> Cumplimiento consistente de nuestras promesas</li>
                  <li><strong>Innovación:</strong> Búsqueda constante de tecnología aplicada</li>
                  <li><strong>Cercanía:</strong> Relaciones de largo plazo con nuestros clientes</li>
                  <li><strong>Profesionalismo:</strong> Conocimiento técnico y actualización continua</li>
                </ul>
              </div>
            )}
          </div>
        </section>
      </FadeIn>

      {/* What We Do */}
      <FadeIn direction="up" delay={0.3}>
        <section className="about-services">
          <TextType
            as="h2"
            text="Qué hacemos"
            typingSpeed={60}
            pauseDuration={800}
            showCursor={false}
            loop={false}
            startOnVisible={true}
          />
          
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">🦷</div>
              <h3>Equipamiento e imagenología</h3>
              <p>
                Provisión e instalación de equipos de última generación para diagnóstico,
                ultrasonido, profilaxis y flujo digital.
              </p>
            </div>
            
            <div className="service-card">
              <div className="service-icon">🧪</div>
              <h3>Insumos y materiales</h3>
              <p>
                Suministro continuo de materiales para estética, restauradora, cirugía,
                endodoncia y prevención.
              </p>
            </div>
            
            <div className="service-card">
              <div className="service-icon">🔧</div>
              <h3>Servicio Técnico</h3>
              <p>
                Mantenimiento preventivo y correctivo, calibraciones y repuestos originales
                con técnicos certificados.
              </p>
            </div>
            
            <div className="service-card">
              <div className="service-icon">🎓</div>
              <h3>Asesoría y formación</h3>
              <p>
                Consultoría en implementación clínica, flujos de trabajo digitales y
                formación continua para equipos odontológicos.
              </p>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* Team */}
      <FadeIn direction="up" delay={0.4}>
        <section className="about-team">
          <TextType
            as="h2"
            text="Nuestro Equipo"
            typingSpeed={60}
            pauseDuration={800}
            showCursor={false}
            loop={false}
            startOnVisible={true}
          />
          
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-card">
                <div className="team-icon">{member.icon}</div>
                <h3>{member.name}</h3>
                <p className="team-role">{member.role}</p>
                <p className="team-description">{member.description}</p>
              </div>
            ))}
          </div>
        </section>
      </FadeIn>

      {/* Brands */}
      <FadeIn direction="up" delay={0.5}>
        <section className="about-brands">
          <TextType
            as="h2"
            text="Representaciones"
            typingSpeed={60}
            pauseDuration={800}
            showCursor={false}
            loop={false}
            startOnVisible={true}
          />
          
          <p className="brands-intro">
            Trabajamos con las marcas líderes del mercado internacional:
          </p>

          <div className="brands-carousel">
            <button
              type="button"
              className="brands-carousel__arrow"
              onClick={handlePrevBrands}
              disabled={brandIndex === 0}
              aria-label="Ver marcas anteriores"
            >
              ←
            </button>
            <div className="brands-grid">
              {brands.slice(brandIndex, brandIndex + 3).map((brand, index) => (
                <div key={`${brand.name}-${index}`} className="brand-card">
                  <h3>{brand.name}</h3>
                  <p className="brand-category">{brand.category}</p>
                  <p className="brand-description">{brand.description}</p>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="brands-carousel__arrow"
              onClick={handleNextBrands}
              disabled={brandIndex >= maxBrandIndex}
              aria-label="Ver más marcas"
            >
              →
            </button>
          </div>
        </section>
      </FadeIn>

      {/* Competitive Advantages */}
      <FadeIn direction="up" delay={0.6}>
        <section className="about-advantages">
          <TextType
            as="h2"
            text="Por qué elegirnos"
            typingSpeed={60}
            pauseDuration={800}
            showCursor={false}
            loop={false}
            startOnVisible={true}
          />
          
          <div className="advantages-list">
            <div className="advantage-item">
              <div className="advantage-icon">✓</div>
              <div className="advantage-content">
                <h3>Experiencia Comprobada</h3>
                <p>Trayectoria atendiendo clínicas y especialistas en todo Chile</p>
              </div>
            </div>
            
            <div className="advantage-item">
              <div className="advantage-icon">✓</div>
              <div className="advantage-content">
                <h3>Servicio Técnico Propio</h3>
                <p>Técnicos certificados con stock de repuestos y mantenimiento preventivo</p>
              </div>
            </div>
            
            <div className="advantage-item">
              <div className="advantage-icon">✓</div>
              <div className="advantage-content">
                <h3>Cobertura Nacional</h3>
                <p>Red de distribución y servicio técnico en todo el país</p>
              </div>
            </div>
            
            <div className="advantage-item">
              <div className="advantage-icon">✓</div>
              <div className="advantage-content">
                <h3>Capacitación Continua</h3>
                <p>Programas de formación clínica y actualización tecnológica</p>
              </div>
            </div>
            
            <div className="advantage-item">
              <div className="advantage-icon">✓</div>
              <div className="advantage-content">
                <h3>Calidad Certificada</h3>
                <p>Productos y servicios alineados con estándares internacionales</p>
              </div>
            </div>
            
            <div className="advantage-item">
              <div className="advantage-icon">✓</div>
              <div className="advantage-content">
                <h3>Atención Personalizada</h3>
                <p>Soluciones adaptadas a las necesidades específicas de cada clínica</p>
              </div>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* CTA Section */}
      <FadeIn direction="up" delay={0.7}>
        <section className="about-cta">
          <div className="cta-content">
            <h2>¿Listo para modernizar tu clínica dental?</h2>
            <p>Contáctanos y descubre cómo podemos ayudarte a optimizar tu práctica</p>
            <div className="cta-buttons">
              <a href="/contacto" className="btn btn-primary">Contáctanos</a>
              <a href="/productos" className="btn btn-secondary">Ver Productos</a>
            </div>
          </div>
        </section>
      </FadeIn>
    </div>
  );
}

export default AboutPage;
