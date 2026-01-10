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

  const teamMembers: TeamMember[] = [
    {
      name: "Atención al Cliente",
      role: "Soporte 24/7",
      description: "Equipo especializado en resolver consultas y necesidades de nuestros clientes",
      icon: "👥"
    },
    {
      name: "Servicio Técnico",
      role: "Mantenimiento",
      description: "Técnicos certificados para instalación, calibración y reparación de equipos",
      icon: "🔧"
    },
    {
      name: "Logística",
      role: "Distribución",
      description: "Red nacional para entrega ágil de productos y repuestos",
      icon: "🚛"
    },
    {
      name: "Capacitación",
      role: "Formación",
      description: "Programas de entrenamiento continuo para usuarios y personal técnico",
      icon: "📚"
    }
  ];

  const brands: Brand[] = [
    {
      name: "Becton Dickinson",
      category: "Diagnóstico y dispositivos médicos",
      description: "Líder mundial en tecnología médica"
    },
    {
      name: "Olympus / Beckman",
      category: "Química clínica",
      description: "Sistemas avanzados de análisis bioquímico"
    },
    {
      name: "Mindray",
      category: "Hematología y equipamiento",
      description: "Tecnología de vanguardia para laboratorios"
    },
    {
      name: "Britania",
      category: "Microbiología",
      description: "Medios de cultivo y soluciones microbiológicas"
    }
  ];

  const achievements = [
    { number: "25+", label: "Años de experiencia", icon: "📅" },
    { number: "500+", label: "Laboratorios atendidos", icon: "🏥" },
    { number: "98%", label: "Satisfacción del cliente", icon: "⭐" },
    { number: "24/7", label: "Soporte técnico", icon: "🔧" }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <FadeIn direction="up">
          <div className="about-hero-content">
            <h1 className="about-title">AMILAB</h1>
            <p className="about-subtitle">Soluciones integrales para laboratorios clínicos</p>
            <div className="about-hero-description">
              <p>
                Somos un equipo especializado en proveer equipamiento, reactivos e insumos 
                de alta calidad para laboratorios clínicos. Nos enfocamos en construir 
                relaciones de largo plazo con nuestros clientes, acompañándolos en su 
                operación diaria con soporte técnico especializado.
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
                  Proveer soluciones integrales para laboratorios clínicos, garantizando 
                  la disponibilidad de equipamiento, reactivos e insumos de calidad, 
                  respaldados por un servicio técnico especializado que asegure la 
                  continuidad operacional de nuestros clientes.
                </p>
              </div>
            )}
            
            {activeTab === 'vision' && (
              <div className="mvv-panel">
                <h3>Nuestra Visión</h3>
                <p>
                  Ser reconocidos como el socio estratégico de referencia para laboratorios 
                  clínicos en Chile, destacando por nuestra excelencia en servicio, 
                  innovación tecnológica y compromiso con la calidad diagnóstica.
                </p>
              </div>
            )}
            
            {activeTab === 'valores' && (
              <div className="mvv-panel">
                <h3>Nuestros Valores</h3>
                <ul className="values-list">
                  <li><strong>Excelencia:</strong> Compromiso con la calidad en cada servicio y producto</li>
                  <li><strong>Confiabilidad:</strong> Cumplimiento consistente de nuestras promesas</li>
                  <li><strong>Innovación:</strong> Búsqueda constante de mejores soluciones</li>
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
              <div className="service-icon">🔬</div>
              <h3>Equipamiento</h3>
              <p>
                Provisión e instalación de equipos de última generación para 
                hematología, química clínica, microbiología y más.
              </p>
            </div>
            
            <div className="service-card">
              <div className="service-icon">💉</div>
              <h3>Reactivos e Insumos</h3>
              <p>
                Suministro continuo de reactivos, controles de calidad y material 
                fungible para la operación diaria del laboratorio.
              </p>
            </div>
            
            <div className="service-card">
              <div className="service-icon">🔧</div>
              <h3>Servicio Técnico</h3>
              <p>
                Mantenimiento preventivo y correctivo, calibraciones, y disponibilidad 
                de repuestos originales con técnicos certificados.
              </p>
            </div>
            
            <div className="service-card">
              <div className="service-icon">📊</div>
              <h3>Asesoría Especializada</h3>
              <p>
                Consultoría en implementación de soluciones, optimización de procesos 
                y cumplimiento de estándares de calidad.
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
          
          <div className="brands-grid">
            {brands.map((brand, index) => (
              <div key={index} className="brand-card">
                <h3>{brand.name}</h3>
                <p className="brand-category">{brand.category}</p>
                <p className="brand-description">{brand.description}</p>
              </div>
            ))}
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
                <p>Más de 25 años trabajando con laboratorios clínicos en todo Chile</p>
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
                <p>Programas de formación para usuarios y personal técnico</p>
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
                <p>Soluciones adaptadas a las necesidades específicas de cada laboratorio</p>
              </div>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* CTA Section */}
      <FadeIn direction="up" delay={0.7}>
        <section className="about-cta">
          <div className="cta-content">
            <h2>¿Listo para mejorar tu laboratorio?</h2>
            <p>Contáctanos y descubre cómo podemos ayudarte a optimizar tus procesos</p>
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
