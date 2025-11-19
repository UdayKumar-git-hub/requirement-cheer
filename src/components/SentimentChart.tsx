import { Cell, Pie, PieChart, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface SentimentChartProps {
  distribution: Record<string, number>;
}

const SentimentChart = ({ distribution }: SentimentChartProps) => {
  const data = [
    { name: 'Positive', value: distribution.positive || 0, color: 'hsl(var(--positive))' },
    { name: 'Neutral', value: distribution.neutral || 0, color: 'hsl(var(--neutral))' },
    { name: 'Negative', value: distribution.negative || 0, color: 'hsl(var(--negative))' },
  ].filter(item => item.value > 0);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
        No data to display
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={true}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={120}
          innerRadius={60}
          fill="#8884d8"
          dataKey="value"
          strokeWidth={3}
          stroke="hsl(var(--background))"
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.color}
              className="hover:opacity-80 transition-opacity cursor-pointer"
            />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ 
            background: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '0.5rem',
            padding: '0.75rem'
          }}
        />
        <Legend 
          verticalAlign="bottom" 
          height={36}
          iconType="circle"
          wrapperStyle={{ paddingTop: '1rem' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default SentimentChart;
