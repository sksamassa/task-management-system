"use server";

import { revalidatePath } from "next/cache";

const deleteTask = async (taskId: string) => {
  const response = await fetch(`/api/tasks/${taskId}`, {
    method: "DELETE",
  });

  if (response.ok) {
    revalidatePath("/");
  }
};

const editTask = async (
  taskId: string,
  data: { title: string; description: string }
) => {
  const response = await fetch(`/api/tasks/${taskId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    revalidatePath("/");
  }
};

const createTask = async (data: {
  userId: string;
  title: string;
  description: string;
}) => {
  const response = await fetch(`/api/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    return { error: true };
  } else {
    revalidatePath("/");
  }
};

export { deleteTask, editTask, createTask };
