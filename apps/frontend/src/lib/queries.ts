import { useQuery, useMutation } from '@tanstack/react-query';

interface HttpOptions {
  body?: unknown;
  method?: 'GET' | 'POST';
}

const http = async <T>(url: string, options?: HttpOptions): Promise<T> => {
  const { body, method = 'GET' } = options ?? {};
  const response = await fetch(url, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json() as Promise<T>;
};

// this url should normally be in an env variable file
const API_URL = 'https://jsonplaceholder.typicode.com';

export interface Article {
  id: number;
  userId: number;
  body: string;
  title: string;
}

export const useGetArticles = () => {
  return useQuery({
    queryKey: ['articles'],
    queryFn: () => http<Article[]>(`${API_URL}/posts`),
  });
};

export const useCreateArticle = () => {
  return useMutation({
    mutationFn: ({ body, title }: { body: string; title: string }) =>
      http<Article>(`${API_URL}/posts`, {
        method: 'POST',
        body: { body, title },
      }),
  });
};
