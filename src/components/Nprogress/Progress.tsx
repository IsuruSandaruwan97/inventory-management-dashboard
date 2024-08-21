/** @format */

import { useNProgress } from "@tanem/react-nprogress";
import { NSpinner, NContainer, Bar } from "@components/Nprogress";

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
