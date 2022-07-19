import { InputWrapper, Input, NumberInput, Group } from '@mantine/core';

export interface LapTimeInputProps {
  required?: boolean;
  label?: React.ReactNode;
  placeHolder?: string;
  value?: number;
  onChange?: (number) => void;
}

const LapTimeInput = (props: LapTimeInputProps) => {
  const { required, label, placeHolder, value, onChange } = props;

  const filteredValue = value && value > 0 ? value : 0;

  const time = new Date(filteredValue);

  const onMinsChange = (n) => onChange(new Date(time).setMinutes(n));
  const onSecsChange = (n) => onChange(new Date(time).setSeconds(n));
  const onMillisChange = (n) => onChange(new Date(time).setMilliseconds(n));

  return (
    <InputWrapper required={required} label={label} placeholder={placeHolder}>
      <Group className='flex-nowrap'>
        <NumberInput
          required={required}
          placeholder='mins'
          value={time.getMinutes()}
          onChange={onMinsChange}
          max={59}
          min={0}
          className='flex-auto'
        />
        :
        <NumberInput
          required={required}
          placeholder='secs'
          value={time.getSeconds()}
          onChange={onSecsChange}
          max={59}
          min={0}
          className='flex-auto'
        />
        .
        <NumberInput
          required={required}
          placeholder='millis'
          value={time.getMilliseconds()}
          onChange={onMillisChange}
          max={59}
          min={0}
          className='flex-auto'
        />
      </Group>
    </InputWrapper>
  );
};

export default LapTimeInput;
