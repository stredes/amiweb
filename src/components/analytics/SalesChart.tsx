import './SalesChart.css';

type DataPoint = {
  label: string;
  value: number;
};

type SalesChartProps = {
  data: DataPoint[];
  title: string;
  color?: string;
};

export function SalesChart({ data, title, color = 'var(--color-primary)' }: SalesChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="sales-chart">
      <h4 className="sales-chart__title">{title}</h4>
      <div className="sales-chart__bars">
        {data.map((item, index) => {
          const heightPercent = (item.value / maxValue) * 100;
          return (
            <div key={index} className="sales-chart__bar-container">
              <div
                className="sales-chart__bar"
                style={{
                  height: `${heightPercent}%`,
                  background: color,
                }}
                title={`${item.label}: ${item.value.toLocaleString('es-CL')}`}
              >
                <span className="sales-chart__value">{item.value.toLocaleString('es-CL')}</span>
              </div>
              <span className="sales-chart__label">{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
