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
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default SentimentChart;
