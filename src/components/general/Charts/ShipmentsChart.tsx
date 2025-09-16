import { useEffect, useRef, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import type { ShipmentsChartProps } from '@types';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const ShipmentsChart = ({ data, loading = false }: ShipmentsChartProps) => {
  const { t } = useTranslation();
  const chartRef = useRef<ChartJS<'line'>>(null);
  
  // Función para convertir hex a rgba
  const hexToRgba = (hex: string, alpha: number = 0.125) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      const r = parseInt(result[1], 16);
      const g = parseInt(result[2], 16);
      const b = parseInt(result[3], 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    return `rgba(42, 43, 61, ${alpha})`;
  };

  // Función para obtener colores iniciales
  const getInitialColors = () => {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    
    const textColor = computedStyle.getPropertyValue('--text2-color').trim() || '#2a2b3d';
    
    return {
      textColor,
      gridColor: hexToRgba(textColor, 0.125),
      backgroundColor: computedStyle.getPropertyValue('--body-bg').trim() || '#ffffff',
    };
  };

  const [themeColors, setThemeColors] = useState(getInitialColors);

  useEffect(() => {
    // Función para obtener variables CSS del tema actual
    function getThemeColors() {
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);
      
      const textColor = computedStyle.getPropertyValue('--text2-color').trim() || '#2a2b3d';
      
      return {
        textColor,
        gridColor: hexToRgba(textColor, 0.125),
        backgroundColor: computedStyle.getPropertyValue('--body-bg').trim() || '#ffffff',
      };
    }

    // Función para actualizar colores cuando cambie el tema
    const updateThemeColors = () => {
      setThemeColors(getThemeColors());
    };

    // Observer para detectar cambios en el tema
    const observer = new MutationObserver(() => {
      updateThemeColors();
    });

    // Observar cambios en el atributo data-theme del documento
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    // Guardar referencia actual del chart para cleanup
    const currentChart = chartRef.current;

    // Cleanup
    return () => {
      observer.disconnect();
      if (currentChart) {
        currentChart.destroy();
      }
    };
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          color: themeColors.textColor,
        },
      },
      title: {
        display: true,
        text: t('shipments-timeline'),
        font: {
          size: 16,
          weight: 'bold' as const,
        },
        color: themeColors.textColor,
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          title: (context: { label?: string }[]) => {
            return context[0]?.label || '';
          },
          label: (context: { dataset: { label?: string }; parsed: { y: number } }) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y || 0;
            return `${label}: ${value} ${value === 1 ? 'envío' : 'envíos'}`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: true,
          color: themeColors.gridColor,
        },
        ticks: {
          color: themeColors.textColor,
        },
        title: {
          display: true,
          text: t('period'),
          color: themeColors.textColor,
          font: {
            weight: 'bold' as const,
          },
        },
      },
      y: {
        display: true,
        grid: {
          display: true,
          color: themeColors.gridColor,
        },
        ticks: {
          color: themeColors.textColor,
          stepSize: 1,
          callback: (value: string | number) => {
            const numValue = typeof value === 'string' ? parseFloat(value) : value;
            if (Number.isInteger(numValue)) {
              return numValue;
            }
            return null;
          },
        },
        title: {
          display: true,
          text: t('total-shipments'),
          color: themeColors.textColor,
          font: {
            weight: 'bold' as const,
          },
        },
        beginAtZero: true,
      },
    },
    elements: {
      line: {
        tension: 0.4,
        borderWidth: 3,
      },
      point: {
        radius: 4,
        hoverRadius: 6,
        borderWidth: 2,
        hoverBorderWidth: 3,
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart' as const,
    },
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">{t('loading')}</span>
        </div>
      </div>
    );
  }

  if (!data || !data.labels || data.labels.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="text-muted">
          <i className="fas fa-chart-line fa-3x mb-3 d-block text-center"></i>
          <p className="text-center">{t('no-data')}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <Line ref={chartRef} data={data} options={options} />
    </div>
  );
};
