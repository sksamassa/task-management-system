"use server";

export const getTasks = async (query: string) => {
  const response = await fetch(
    `${process.env.SITE_BASE_URL}/api/tasks?query=${encodeURIComponent(query)}`
  );
  const data = await response.json();
  
  return data.tasks || []; // Ensure it always returns an array
};