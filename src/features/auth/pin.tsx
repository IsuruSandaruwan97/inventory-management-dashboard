import { StyleSheet } from '@configs/stylesheet';
import { Col, Flex, Typography } from 'antd';
import { useRef } from 'react';
import { PinField, PinFieldProps } from 'react-pin-field';

type PinProps = PinFieldProps & { error: boolean };

const Pin = ({ error, ...others }: PinProps) => {
  const pinRef = useRef<HTMLInputElement[]>(null);
  return (
    <form className="pinForm">
      <Flex style={styles.container}>
        <Col>
          <Typography.Title style={styles.title}>Pin Code</Typography.Title>
          <PinField
            className={`pin-field ${error ? 'invalid' : ''}`}
            length={4}
            ref={pinRef}
            validate="0123456789"
            inputMode="numeric"
            type="password"
            {...others}
          />
          {error && (
            <Typography.Text type="danger" style={styles.error}>
              Invalid pin code
            </Typography.Text>
          )}
        </Col>
      </Flex>
    </form>
  );
};

export default Pin;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E9ECEF',
    minHeight: '100vh',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  title: {
    marginTop: '-50%',
  },
  error: {
    display: 'block',
    fontSize: '12px',
    fontWeight: 500,
  },
});
