import './PieChart.css';

type PieChartData = {
  label: string;
  value: number;
  color: string;
};

type PieChartProps = {
  data: PieChartData[];
  title: string;
};

export function PieChart({ data, title }: PieChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercent = 0;

  const segments = data.map((item) => {
    const percent = (item.value / total) * 100;
    const startAngle = (cumulativePercent / 100) * 360;
    cumulativePercent += percent;
    const endAngle = (cumulativePercent / 100) * 360;

    return {
      ...item,
      percent,
      startAngle,
      endAngle,
    };
  });

  return (
    <div className="pie-chart">
      <h4 className="pie-chart__title">{title}</h4>
      <div className="pie-chart__container">
        <div className="pie-chart__svg-container">
          <svg viewBox="0 0 200 200" className="pie-chart__svg">
            <circle cx="100" cy="100" r="80" fill="var(--color-gray-100)" />
            {segments.map((segment, index) => {
              const startRad = (segment.startAngle * Math.PI) / 180;
              const endRad = (segment.endAngle * Math.PI) / 180;
              const x1 = 100 + 80 * Math.cos(startRad - Math.PI / 2);
              const y1 = 100 + 80 * Math.sin(startRad - Math.PI / 2);
              const x2 = 100 + 80 * Math.cos(endRad - Math.PI / 2);
              const y2 = 100 + 80 * Math.sin(endRad - Math.PI / 2);
              const largeArc = segment.percent > 50 ? 1 : 0;

              return (
                <path
                  key={index}
                  d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`}
                  fill={segment.color}
                  className="pie-chart__segment"
                  style={{ '--segment-color': segment.color } as React.CSSProperties}
                >
                  <title>
                    {segment.label}: {segment.percent.toFixed(1)}%
                  </title>
                </path>
              );
            })}
            <circle cx="100" cy="100" r="50" fill="var(--color-white)" className="pie-chart__center" />
          </svg>
        </div>

        <div className="pie-chart__legend">
          {data.map((item, index) => {
            const percent = ((item.value / total) * 100).toFixed(1);
            return (
              <div key={index} className="pie-chart__legend-item">
                <span className="pie-chart__legend-color" style={{ background: item.color }} />
                <span className="pie-chart__legend-label">{item.label}</span>
                <span className="pie-chart__legend-value">
                  {percent}% ({item.value.toLocaleString('es-CL')})
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
