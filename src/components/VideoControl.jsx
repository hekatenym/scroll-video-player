import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import './VideoControl.css';

const VideoControl = forwardRef(({ onScrollHeightChange, totalHeight, browserFps }, ref) => {
  const [scrollFPS, setScrollFPS] = useState(0);
  const sliderRef = useRef(null);

  useImperativeHandle(ref, () => ({
    updateScrollFPS: (scrollPosition, totalFrames, scrollHeight) => {
      const fps = (totalFrames / scrollHeight) * 100;
      setScrollFPS(Math.round(fps * 100) / 100);
    }
  }));

  const handleSliderChange = (e) => {
    const newScrollHeight = parseInt(e.target.value, 10);
    onScrollHeightChange(newScrollHeight);
  };

  return (
    <div className="video-control">
      <div>
        <label>滚动高度控制 (200px - 4000px)：</label>
        <input
          ref={sliderRef}
          type="range"
          min="200"
          max="4000"
          step="100"
          defaultValue={totalHeight}
          onChange={handleSliderChange}
        />
        <span>{totalHeight}px</span>
      </div>
      <div className="fps-display">
        <span>滚动帧率: {scrollFPS} 帧/100px</span>
        <span>浏览器帧率: {browserFps} FPS</span>
      </div>
    </div>
  );
});

export default VideoControl;
