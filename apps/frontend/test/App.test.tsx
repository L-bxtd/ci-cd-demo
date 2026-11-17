import { render, screen, waitFor } from '@testing-library/react';
import { it, expect, vi } from 'vitest';
import App from '../src/App';

it('等待消息与版本真正渲染完成', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async (input: RequestInfo | URL) => {
      const raw = input instanceof Request ? input.url : String(input);
      const url = new URL(raw, 'http://localhost');
      if (url.pathname === '/api/hello') {
        return new Response(JSON.stringify({ message: 'Hello from backend' }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }
      if (url.pathname === '/api/version') {
        return new Response('test-version');
      }
      throw new Error('Unexpected endpoint');
    })
  );

  render(<App />);

  await waitFor(() => {
    expect(screen.getByTestId('backend-msg')).toHaveTextContent('Hello from backend');
  });
  expect(await screen.findByText(/test-version/)).toBeInTheDocument();
});

it('接口失败时展示错误而不是空白', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => new Response('boom', { status: 500 }))
  );

  render(<App />);

  await waitFor(() => {
    expect(screen.getByTestId('backend-msg')).toHaveTextContent('请求失败：HTTP 500');
  });
});
