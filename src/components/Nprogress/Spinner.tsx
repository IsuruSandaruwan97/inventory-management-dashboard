import '@components/Nprogress/spinner.css';
import { StyleSheet } from '@configs/stylesheet';

export const NSpinner = () => (
  <div style={styles.container}>
    <div style={styles.loader} />
  </div>
);

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    position: 'absolute',
    right: 0,
    left: 0,
    bottom: 0,
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1031,
    backdropFilter: 'blur(2px)',
  },
  loader: {
    animation: '400ms linear infinite spinner',
    borderBottom: '2px solid transparent',
    borderLeft: '2px solid #29d',
    borderRadius: '50%',
    borderRight: '2px solid transparent',
    borderTop: '2px solid #29d',
    boxSizing: 'border-box',
    height: 36,
    width: 36,
  },
});
