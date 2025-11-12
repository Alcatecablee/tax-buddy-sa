import { QueryClient } from "@tanstack/react-query";

async function handleFetch(url: string, options?: RequestInit) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    credentials: "include",
  });

  if (!response.ok) {
    if (response.status >= 500) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    const message = await response.text();
    throw new Error(message || `${response.status}: ${response.statusText}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export async function apiRequest(url: string, options?: RequestInit) {
  return handleFetch(url, options);
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const url = queryKey[0] as string;
        return handleFetch(url);
      },
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});
