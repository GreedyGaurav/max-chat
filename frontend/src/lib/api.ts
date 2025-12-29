export const apiFetch = (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token");

  return fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });
};
