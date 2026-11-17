import { useEffect, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

export default function App() {
  const [msg, setMsg] = useState('加载中…');
  const [version, setVersion] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const helloRes = await fetch(`${API_BASE}/api/hello`);
        if (!helloRes.ok) throw new Error(`HTTP ${helloRes.status}`);
        const data = await helloRes.json();

        const versionRes = await fetch(`${API_BASE}/api/version`);
        const versionText = versionRes.ok ? await versionRes.text() : '未知';

        if (cancelled) return;
        setMsg(data.message);
        setVersion(versionText);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : String(err));
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main style={{ fontFamily: 'system-ui, "Microsoft YaHei", sans-serif', maxWidth: 640, margin: '48px auto', padding: '0 16px' }}>
      <h1>CI/CD Demo（React + Node）</h1>
      <p>
        后端消息：<strong data-testid="backend-msg">{error ? `请求失败：${error}` : msg}</strong>
      </p>
      <p>
        后端版本：<code>{version || '加载中…'}</code>
      </p>
      <p style={{ color: '#6b7280', fontSize: 14 }}>
        接口来源：{API_BASE || '同源（开发模式经 Vite 代理到 127.0.0.1:3000）'}
      </p>
    </main>
  );
}
