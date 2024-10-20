import React from 'react';
import ScrollVideoPlayer from './components/ScrollVideoPlayer';
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <div className="App">
        <header className="App-header">
          <h1>视频滚动播放演示</h1>
        </header>
        <main>
          <p>请向下滚动以查看视频播放效果</p>
          <ScrollVideoPlayer videoSrc="/videos/0164192f-5a52-4b32-a275-099a2cf71860.mp4" />
          <div className="content">
            <h2>内容区域</h2>
            <p>这里可以放置一些额外的内容...</p>
            {/* 可以添加更多内容 */}
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
