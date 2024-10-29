import { db } from "@/db/drizzle";
import redis from "@/db/redis";
import { tasks } from "@/db/schemas/tasksSchema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// Get a single task
export async function GET(req: NextRequest, { params }: { params: { taskId: string } }) {
  try {
    const taskId = params.taskId;

    const [task] = await db.select().from(tasks).where(eq(tasks.id, taskId));

    return NextResponse.json({ task }, { status: 200 });
  } catch (_) {
    return NextResponse.json({ message: "Task not found." }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const taskId = params.taskId;
    const { title, description, completed } = await req.json();

    // Update the task
    const [updatedTask] = await db
      .update(tasks)
      .set({
        title,
        description,
        completed,
      })
      .where(eq(tasks.id, taskId))
      .returning();

    // Invalidate cache
    await redis.del("all_tasks");
    await redis.del(`user_tasks:${updatedTask.userId}`);

    return NextResponse.json({ task: updatedTask }, { status: 200 });
  } catch (_) {
    return NextResponse.json(
      { message: "Failed to update task." },
      { status: 500 }
    );
  }
}

// Delete a task
export async function DELETE(req: NextRequest, { params }: { params: { taskId: string } }) {
  try {
    const taskId = params.taskId;

    const [deletedTask] = await db
      .delete(tasks)
      .where(eq(tasks.id, taskId))
      .returning({ taskId: tasks.id, userId: tasks.userId });

    // Invalidate cache
    await redis.del("all_tasks");
    await redis.del(`user_tasks:${deletedTask.userId}`);

    return NextResponse.json({ message: "Task deleted." }, { status: 200 });
  } catch (_) {
    return NextResponse.json(
      { message: "Failed to delete task." },
      { status: 500 }
    );
  }
}
