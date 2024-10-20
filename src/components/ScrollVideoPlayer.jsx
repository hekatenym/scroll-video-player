import React, { useRef, useEffect, useState, useCallback } from 'react';
import VideoControl from './VideoControl';
import './ScrollVideoPlayer.css';

// 简单的节流函数
const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

const ScrollVideoPlayer = ({ videoSrc }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [aspectRatio, setAspectRatio] = useState(16 / 9);
  const [scrollHeight, setScrollHeight] = useState(2000);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [totalFrames, setTotalFrames] = useState(0);
  const videoControlRef = useRef(null);
  const [browserFps, setBrowserFps] = useState(0);
  const lastFrameTimeRef = useRef(performance.now());
  const frameCountRef = useRef(0);
  const rafIdRef = useRef(null);

  const setCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (canvas && container) {
      const containerWidth = container.clientWidth;
      canvas.width = containerWidth;
      canvas.height = containerWidth / aspectRatio;
    }
  }, [aspectRatio]);

  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video) {
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    }
  }, []);

  const updateFPS = useCallback(() => {
    const currentFrameTime = performance.now();
    const deltaTime = currentFrameTime - lastFrameTimeRef.current;
    frameCountRef.current++;

    if (deltaTime >= 1000) {
      const fps = (frameCountRef.current / deltaTime) * 1000;
      setBrowserFps(Math.round(fps * 100) / 100); // 保留两位小数
      lastFrameTimeRef.current = currentFrameTime;
      frameCountRef.current = 0;
    }

    rafIdRef.current = requestAnimationFrame(updateFPS);
  }, []);

  const throttledDrawFrame = useCallback(throttle(drawFrame, 1000 / 30), [drawFrame]); // 限制为最多每秒30帧

  const updateVideoTime = useCallback((scrollPosition) => {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    const scrollPercentage = scrollPosition / scrollHeight;
    const targetTime = scrollPercentage * video.duration;
    video.currentTime = targetTime;
    throttledDrawFrame(); // 在更新视频时间后绘制帧
  }, [scrollHeight, throttledDrawFrame]);

  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY;
    updateVideoTime(scrollPosition);
    setCurrentPosition(scrollPosition);
    if (videoControlRef.current) {
      videoControlRef.current.updateScrollFPS(scrollPosition, totalFrames, scrollHeight);
    }
  }, [updateVideoTime, totalFrames, scrollHeight]);

  const handleScrollHeightChange = useCallback((newScrollHeight) => {
    setScrollHeight(newScrollHeight);
    containerRef.current.style.height = `${newScrollHeight}px`;
    handleScroll();
  }, [handleScroll]);

  useEffect(() => {
    const video = videoRef.current;

    const handleLoadedMetadata = () => {
      const videoAspectRatio = video.videoWidth / video.videoHeight;
      setAspectRatio(videoAspectRatio);
      setCanvasSize();
      setTotalFrames(Math.round(video.duration * 30)); // 使用估计值
      throttledDrawFrame(); // 在元数据加载后绘制第一帧
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('error', (e) => {
      console.error('Video error:', video.error);
    });

    window.addEventListener('resize', setCanvasSize);
    window.addEventListener('scroll', handleScroll);

    // 开始计算浏览器帧率
    rafIdRef.current = requestAnimationFrame(updateFPS);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      window.removeEventListener('resize', setCanvasSize);
      window.removeEventListener('scroll', handleScroll);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [setCanvasSize, handleScroll, updateFPS, throttledDrawFrame]);

  return (
    <div className="scroll-video-container" ref={containerRef} style={{ height: `${scrollHeight}px` }}>
      <div className="scroll-video-sticky">
        <VideoControl
          ref={videoControlRef}
          onScrollHeightChange={handleScrollHeightChange}
          totalHeight={scrollHeight}
          browserFps={browserFps}
        />
        <canvas ref={canvasRef} />
        <video 
          ref={videoRef} 
          src={videoSrc} 
          style={{ display: 'none' }} 
          preload="auto"
          muted
        />
      </div>
      <div className="scroll-markers">
        <div className="scroll-start-line" />
        <div className="scroll-end-line" style={{ top: `${scrollHeight}px` }} />
        <div className="scroll-current-line" style={{ top: `${currentPosition}px` }} />
      </div>
    </div>
  );
};

export default ScrollVideoPlayer;
