import { useRef, useState } from 'react';

const useSectionScroll = () => {
  const sectionFirstRef = useRef<HTMLElement>(null);
  const sectionSecondRef = useRef<HTMLElement>(null);
  const [isFirstSection, setIsFirstSection] = useState(true);

  const handleDownClick = () => {
    sectionSecondRef.current?.scrollIntoView({ behavior: 'smooth' });
    setIsFirstSection(!isFirstSection);
  };

  const handleUpClick = () => {
    sectionFirstRef.current?.scrollIntoView({ behavior: 'smooth' });
    setIsFirstSection(!isFirstSection);
  };

  return {
    refs: { sectionFirstRef, sectionSecondRef },
    handlers: { handleDownClick, handleUpClick },
  };
};

export default useSectionScroll;
