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

  const mins = Math.max(Math.trunc(filteredValue / 60000), 0);
  const secs = Math.max(Math.trunc((filteredValue - mins * 60000) / 1000), 0);
  const millis = Math.max(filteredValue - mins * 60000 - secs * 1000, 0);

  // console.log('value:', value, 'mins', mins, 'secs', secs, 'millis', millis);

  const onMinsChange = (n) => onChange(value - mins * 60000 + n * 60000);
  const onSecsChange = (n) => onChange(value - secs * 1000 + n * 1000);
  const onMillisChange = (n) => onChange(value - millis + n);

  return (
    <InputWrapper required={required} label={label} placeholder={placeHolder}>
      <Group className='flex-nowrap'>
        <NumberInput
          required={required}
          placeholder='mins'
          value={mins}
          onChange={onMinsChange}
          max={59}
          min={0}
          className='flex-auto'
        />
        :
        <NumberInput
          required={required}
          placeholder='secs'
          value={secs}
          onChange={onSecsChange}
          max={59}
          min={0}
          className='flex-auto'
        />
        :
        <NumberInput
          required={required}
          placeholder='millis'
          value={millis}
          onChange={onMillisChange}
          max={59}
          min={0}
          className='flex-auto'
        />
      </Group>
    </InputWrapper>
  );
};

export default TimeInput;
