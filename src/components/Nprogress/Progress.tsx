/** @format */

import { Bar, NContainer, NSpinner } from '@components/Nprogress';
import { useNProgress } from '@tanem/react-nprogress';

type Props = {
  isAnimating?: boolean;
};

export const NProgress = ({ isAnimating }: Props) => {
  const { animationDuration, isFinished, progress } = useNProgress({
    isAnimating,
  });

  return (
    <NContainer animationDuration={animationDuration} isFinished={isFinished}>
      <Bar animationDuration={animationDuration} progress={progress} />
      <NSpinner />
    </NContainer>
  );
};
