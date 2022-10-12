import { Button, ScrollArea, Stack, Text } from '@mantine/core';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Download } from 'tabler-icons-react';
import useEcu from '../lib/EcuContext';
import { EnergyFrame, VehicleClass } from '../lib/proto/evolocity';
import * as csv from 'csv';

interface EcuChartProps {
  energyFrames: EnergyFrame[];
}

const EcuChart = ({ energyFrames }: EcuChartProps) => {
  const { ecuTeam, ecuState } = useEcu();

  const getVoltageLimit = () => {
    if (ecuTeam?.class === VehicleClass.STANDARD) return 40;
    if (ecuTeam?.class === VehicleClass.OPEN) return 60;
    if (ecuTeam?.class === VehicleClass.COMPETITION) return 80;
    else return 120;
  };

  const getCurrentLimit = () => {
    if (ecuTeam?.class === VehicleClass.STANDARD) return 25;
    if (ecuTeam?.class === VehicleClass.OPEN) return 50;
    if (ecuTeam?.class === VehicleClass.COMPETITION) return 90;
    else return 120;
  };

  const getPowerLimit = () => {
    if (ecuTeam?.class === VehicleClass.STANDARD) return 500;
    if (ecuTeam?.class === VehicleClass.OPEN) return 1200;
    if (ecuTeam?.class === VehicleClass.COMPETITION) return 3500;
    else return 5000;
  };

  const discontinuityFilter = (v: number, i: number, a: EnergyFrame[]) => {
    if (a[i - 1] !== undefined && a[i] !== undefined) {
      return getTimeDeltaSeconds(a[i - 1], a[i]) < 60 ? v : null;
    }
    return v;
  };
  const getTime = (eF: EnergyFrame) => eF.endTimestamp * 1000;
  const getVoltage = (eF: EnergyFrame) => eF.averageVoltage / 1000;
  const getCurrent = (eF: EnergyFrame) => eF.averageCurrent / 1000;
  const getPower = (eF: EnergyFrame) => getVoltage(eF) * getCurrent(eF);
  const getTimeDeltaSeconds = (p: EnergyFrame, c: EnergyFrame) => c.endTimestamp - p.endTimestamp;
  const getEnergy = (c: EnergyFrame) => c.totalEnergy / 60 / 60;

  const data = energyFrames
    .sort((a, b) => a.endTimestamp - b.endTimestamp)
    .map((eF, i, a) => ({
      Time: getTime(eF),
      Voltage: discontinuityFilter(getVoltage(eF), i, a),
      Current: discontinuityFilter(getCurrent(eF), i, a),
      Power: discontinuityFilter(getPower(eF), i, a),
      Energy: a[i - 1] !== undefined ? discontinuityFilter(getEnergy(eF), i, a) : 0,
    }));
  const cumulativeEnergyData = data.reduce<{ Time: number; Power: number; 'Total Energy': number }[]>(
    (pV, eF) =>
      pV.length > 0
        ? [
            ...pV,
            {
              Time: eF['Time'],
              Power: eF['Power'],
              'Total Energy': pV[pV.length - 1]['Total Energy'] + eF['Energy'],
            },
          ]
        : [
            {
              Time: eF['Time'],
              Power: eF['Power'],
              'Total Energy': 0,
            },
          ],
    []
  );

  const handleDownload = () => {
    csv.stringify(
      data,
      {
        header: true,
        columns: {
          Time: 'Time',
          Voltage: 'Voltage',
          Current: 'Current',
          Power: 'Power',
          Energy: 'Energy',
        },
      },
      (err, output) => {
        if (err) {
          console.error(err);
        } else {
          const blob = new Blob([output], { type: 'text/csv' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${ecuTeam?.number ? ecuTeam?.number + '-' : ''}${ecuTeam?.name.replace(' ', '-') ?? 'unknown-team'}-data.csv`;
          a.click();
          URL.revokeObjectURL(url);
        }
      }
    );
  };

  return (
    <ScrollArea>
      <Stack className='h-full min-w-[600px]'>
        <ResponsiveContainer width='100%' height={400}>
          <LineChart width={1000} height={400} data={data} margin={{ top: 0, right: 10, left: 10, bottom: 0 }} syncId='ecu'>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='Time' tickFormatter={(unixTime) => new Date(unixTime).toLocaleTimeString()} type='number' domain={['dataMin', 'dataMax']} />
            <YAxis
              yAxisId='left'
              label={{
                value: 'Voltage (V)',
                angle: -90,
                position: 'insideLeft',
              }}
              orientation='left'
              domain={[0, getVoltageLimit()]}
            />
            <YAxis
              yAxisId='right'
              label={{
                value: 'Current (A)',
                angle: -90,
                position: 'insideTopRight',
              }}
              orientation='right'
              domain={[0, getCurrentLimit()]}
            />
            <Tooltip labelFormatter={(unixTime) => new Date(unixTime).toLocaleTimeString()} />
            <Legend />
            <Line type='monotone' unit='V' yAxisId='left' dataKey='Voltage' stroke='rgb(225 29 72)' dot={false} strokeWidth={3} />
            <Line type='monotone' unit='A' yAxisId='right' dataKey='Current' stroke='rgb(79 70 229)' dot={false} strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
        <ResponsiveContainer width='100%' height={400}>
          <LineChart data={cumulativeEnergyData} margin={{ top: 0, right: 10, left: 10, bottom: 0 }} syncId='ecu'>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='Time' tickFormatter={(unixTime) => new Date(unixTime).toLocaleTimeString()} type='number' domain={['dataMin', 'dataMax']} />
            <YAxis
              yAxisId='left'
              label={{
                value: 'Total Energy (Wh)',
                angle: -90,
                position: 'insideLeft',
              }}
              orientation='left'
              domain={[0, getPowerLimit()]}
            />
            <YAxis
              yAxisId='right'
              label={{
                value: 'Power (W)',
                angle: -90,
                position: 'insideTopRight',
              }}
              orientation='right'
              domain={[0, getPowerLimit()]}
            />
            <Tooltip labelFormatter={(unixTime) => new Date(unixTime).toLocaleTimeString()} />
            <Legend />
            <Line type='monotone' unit='Wh' yAxisId='left' dataKey='Total Energy' stroke='rgb(16 185 129)' dot={false} strokeWidth={3} />
            <Line type='monotone' unit='W' yAxisId='right' dataKey='Power' stroke='rgb(245 158 11)' dot={false} strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </Stack>
      <Button type='button' className='bg-blue-600 hover:bg-blue-800' disabled={ecuState !== 'Ready'} onClick={handleDownload} leftIcon={<Download />}>
        <Text>Download Data as CSV</Text>
      </Button>
    </ScrollArea>
  );
};

export default EcuChart;
