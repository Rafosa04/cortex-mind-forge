
import { useState, useEffect } from 'react';

export const useDimensions = (isFullscreen: boolean) => {
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const updateDimensions = () => {
      if (isFullscreen) {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        });
      } else {
        setDimensions({
          width: window.innerWidth,
          height: Math.max(window.innerHeight - 120, 600)
        });
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => window.removeEventListener('resize', updateDimensions);
  }, [isFullscreen]);

  return dimensions;
};
