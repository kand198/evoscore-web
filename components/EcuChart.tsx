import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { EnergyFrame } from '../lib/proto/evolocity';

interface EcuChartProps {
  energyFrames: EnergyFrame[];
}

const EcuChart = ({ energyFrames }: EcuChartProps) => {
  const data = energyFrames.sort((a, b) => a.endTimestamp - b.endTimestamp).map((eF) => ({
    time: new Date(eF.endTimestamp * 1000).toLocaleTimeString(),
    averageVoltage: eF.averageVoltage / 1000,
    averageCurrent: eF.averageCurrent / 1000,
    averagePower: ((eF.averageVoltage / 1000) * eF.averageCurrent) / 1000,
  }));
  return (
    <LineChart
      // width={1000}
      // height={400}
      width={1000}
      height={400}
      className='grow'
      data={data}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray='3 3' />
      <XAxis dataKey='time' />
      <YAxis yAxisId='left' />
      <YAxis yAxisId='right' orientation='right' />
      <Tooltip />
      <Legend />
      <Line
        type='monotone'
        unit='V'
        yAxisId='left'
        dataKey='averageVoltage'
        stroke='rgb(225 29 72)'
        dot={false}
        strokeWidth={3}
      />
      <Line
        type='monotone'
        unit='A'
        yAxisId='left'
        dataKey='averageCurrent'
        stroke='rgb(79 70 229)'
        dot={false}
        strokeWidth={3}
      />
      <Line
        type='monotone'
        unit='W'
        yAxisId='right'
        dataKey='averagePower'
        stroke='rgb(245 158 11)'
        dot={false}
        strokeWidth={3}
      />
    </LineChart>
  );
};

export default EcuChart;
