import { useEffect } from 'react';

interface ScheduleCallProps {
  calendlyUrl: string;
}

export default function ScheduleCall({ calendlyUrl }: ScheduleCallProps) {
  useEffect(() => {
    // Cargar el script de Calendly
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Limpiar el script cuando el componente se desmonte
      document.body.removeChild(script);
    };
  }, []);

  return (
    <section id="agendar-reunion" className="schedule-call-section py-16 h-screen">
      <div 
        className="calendly-inline-widget" 
        data-url={calendlyUrl} 
        style={{ minWidth: '320px', height: '800px', overflow: 'visible' }}
      />
    </section>
  );
} 