# Scroll Video Player

## 项目简介

Scroll Video Player 是一个 React 组件，它允许用户通过滚动页面来控制视频播放。这个项目旨在提供一种独特的视频观看体验，特别适合用于产品展示、教育内容或交互式故事讲述。

## 主要功能

1. 滚动控制视频播放：用户可以通过滚动页面来前进或后退视频内容。
2. 动态滚动高度调整：用户可以调整滚动高度，以控制视频播放的精度。
3. 实时性能监控：显示当前的滚动帧率和浏览器渲染帧率。
4. 响应式设计：适应不同屏幕尺寸和设备。

## 技术栈

- React
- HTML5 Canvas
- CSS3

## 开发历程

1. 初始化项目：创建基本的 React 组件结构。
2. 实现视频滚动控制：将页面滚动与视频播放进度关联。
3. 添加 Canvas 渲染：使用 HTML5 Canvas 绘制视频帧，提高性能。
4. 开发滚动高度控制：允许用户调整滚动敏感度。
5. 实现性能监控：添加滚动帧率和浏览器帧率的实时显示。
6. 优化渲染性能：使用 throttle 技术限制帧绘制频率，提高页面流畅度。
7. 重构和代码优化：提高代码可读性和可维护性。

## 安装和使用

1. 克隆仓库：
   ```
   git clone https://github.com/your-username/scroll-video-player.git
   ```

2. 安装依赖：
   ```
   cd scroll-video-player
   npm install
   ```

3. 运行开发服务器：
   ```
   npm start
   ```

4. 在你的 React 应用中使用组件：
   ```jsx
   import ScrollVideoPlayer from './components/ScrollVideoPlayer';

   function App() {
     return (
       <div className="App">
         <ScrollVideoPlayer videoSrc="/path/to/your/video.mp4" />
       </div>
     );
   }
   ```
