import 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  Rectangle
} from 'recharts';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 rounded-lg">
        <p className="text-xs font-semibold">Date: {label}</p>
        <p className="text-xs">Avg delivery rating: {payload[0].value}</p>
        <p className="text-xs">Avg taste rating: {payload[1].value}</p>
      </div>
    );
  }

  return null;
};

export default function VerticalChart({ data }: { data: any[] }) {
  return (
    <BarChart
      width={800}
      height={500}
      data={data}
      barSize={15}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip content={<CustomTooltip />} />
      <Legend />
      <Bar
        dataKey="avgDeliveryRating"
        fill="#000"
        activeBar={<Rectangle fill="pink" stroke="blue" />}
      />
      <Bar
        dataKey="avgTasteRating"
        fill="#aaa"
        activeBar={<Rectangle fill="gold" stroke="purple" />}
      />
    </BarChart>
  );
}
