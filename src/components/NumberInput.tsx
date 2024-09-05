import { InputNumber, InputNumberProps } from 'antd';

const NumberInput = ({ ...props }: InputNumberProps) => {
  return (
    <InputNumber
      onKeyDown={(event) => {
        if (!/[0-9]/.test(event.key)) {
          event.preventDefault();
        }
      }}
      {...props}
    />
  );
};

export default NumberInput;
