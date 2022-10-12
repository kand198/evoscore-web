import { Input, Group } from '@mantine/core';
import { DatePicker, TimeInput } from '@mantine/dates';

export interface DateTimeInputProps {
  required?: boolean;
  label?: React.ReactNode;
  placeHolder?: string;
  value?: number;
  onChange?: (number) => void;
}

const DateTimeInput = (props: DateTimeInputProps) => {
  const { required, label, placeHolder, value, onChange } = props;

  const filteredValue = value && value > 0 ? value : 0;
  const time = new Date(filteredValue);

  const compileDateChange = (v: Date) => {
    const d = new Date(v);
    d.setHours(time.getHours());
    d.setMinutes(time.getMinutes());
    d.setSeconds(time.getSeconds());
    d.setMilliseconds(time.getMilliseconds());
    return d;
  };

  const compileTimeChange = (v: Date) => {
    const d = new Date(v);
    return d;
  };

  const onDateChange = onChange !== undefined ? (n) => onChange(compileDateChange(n).getTime()) : () => {};
  const onTimeChange = onChange !== undefined ? (n) => onChange(compileTimeChange(n).getTime()) : () => {};

  return (
    <Input.Wrapper required={required} label={label} placeholder={placeHolder}>
      <Group className='flex-nowrap max-w-sm gap-x-1 overflow-x-hidden'>
        <DatePicker placeholder='Pick date' label='Date' defaultValue={time} onChange={onDateChange} className='grow' required dropdownType='modal' />
        <TimeInput
          placeholder='Pick time'
          format='12'
          label='Time'
          defaultValue={time}
          onChange={onTimeChange}
          className='shrink min-w-0'
          withSeconds
          required
        />
      </Group>
    </Input.Wrapper>
  );
};

export default DateTimeInput;
