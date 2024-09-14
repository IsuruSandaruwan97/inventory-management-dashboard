import { InputNumber, InputNumberProps } from 'antd';

const NumberInput = ({ currency, ...props }: InputNumberProps & { currency?: boolean }) => {
  return (
    <InputNumber
      onKeyDown={(event) => {
        if (!/[0-9]/.test(event.key) && event.key !== '.' && event.key !== 'Backspace') {
          event.preventDefault();
        }
        // Prevent multiple decimal points
        if (event.key === '.' && event.currentTarget.value.includes('.')) {
          event.preventDefault();
        }
      }}
      {...props}
      value={typeof props.value === 'number' ? parseFloat(String(props.value)) : props.value}
      precision={currency ? 2 : 0}
    />
  );
};

export default NumberInput;
