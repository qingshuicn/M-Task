import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="app-shell">
        <section className="hero">
          <h1>mdtsk 任务协同平台</h1>
          <p>欢迎来到 mdtsk 的前端代码基座。接下来请在此基础上构建任务看板、通知中心等核心功能。</p>
        </section>
        <section className="next-steps">
          <h2>下一步开发建议</h2>
          <ul>
            <li>接入后端 API，完成任务模板与实例数据的读取。</li>
            <li>实现拖拽式任务看板，展示任务状态流转。</li>
            <li>通过 WebSocket 或 SSE 完成实时更新。</li>
          </ul>
        </section>
      </main>
    </QueryClientProvider>
  );
}

export default App;
