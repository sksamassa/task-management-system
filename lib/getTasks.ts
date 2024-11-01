"use server";

export const getTasks = async (query: string) => {
  const response = await fetch(`/api/tasks?query=${encodeURIComponent(query)}`);
  const data = await response.json();

  return data.tasks || []; // Ensure it always returns an array
};
