import { InputWrapper, Input, NumberInput, Group } from '@mantine/core';

export interface TimeInputProps {
  required?: boolean;
  label?: React.ReactNode;
  placeHolder?: string;
  value?: number;
  onChange?: (number) => void;
}

const TimeInput = (props: TimeInputProps) => {
  const { required, label, placeHolder, value, onChange } = props;

  const filteredValue = value && value > 0 ? value : 0;

  const time = new Date(filteredValue);

  const onHoursChange = onChange !== undefined ? (n) => onChange(new Date(time).setHours(n)) : () => {};
  const onMinsChange = onChange !== undefined ? (n) => onChange(new Date(time).setMinutes(n)) : () => {};
  const onSecsChange = onChange !== undefined ? (n) => onChange(new Date(time).setSeconds(n)) : () => {};

  return (
    <InputWrapper required={required} label={label} placeholder={placeHolder}>
      <Group className='flex-nowrap max-w-sm gap-x-1'>
        <NumberInput
          required={required}
          placeholder='mins'
          value={time.getHours()}
          onChange={onHoursChange}
          max={59}
          min={0}
        />
        :
        <NumberInput
          required={required}
          placeholder='secs'
          value={time.getMinutes()}
          onChange={onMinsChange}
          max={59}
          min={0}
        />
        :
        <NumberInput
          required={required}
          placeholder='millis'
          value={time.getSeconds()}
          onChange={onSecsChange}
          max={59}
          min={0}
        />
      </Group>
    </InputWrapper>
  );
};

export default TimeInput;
