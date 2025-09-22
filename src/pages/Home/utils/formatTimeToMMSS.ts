const formatTimeToMMSS = (remainingSeconds: number) => {
  const min = Math.floor(remainingSeconds / 60);
  const sec = remainingSeconds % 60;

  const paddedMin = String(min).padStart(2, '0');
  const paddedSec = String(sec).padStart(2, '0');

  return `${paddedMin}:${paddedSec}`;
};

export default formatTimeToMMSS;
