import { db } from "@/db/drizzle";
import redis from "@/db/redis";
import { tasks } from "@/db/schemas/tasksSchema";
import { NextRequest, NextResponse } from "next/server";

const CACHE_EXPIRY = 60; // Cache expiry time in seconds

// Create a new task
export async function POST(req: NextRequest) {
  try {
    const { userId, title, description } = await req.json();
    if (!title || !userId) {
      return NextResponse.json(
        { message: 'Both title and userId are required.' },
        { status: 400 }
      );
    }

    // Insert the task into the database
    const [newTask] = await db
      .insert(tasks)
      .values({
        userId: userId,
        title,
        description,
      })
      .returning();

    // Invalidate Redis cache
    await redis.del('all_tasks');  // Invalidate cache for all tasks
    await redis.del(`user_tasks:${userId}`); // Invalidate cache for user tasks

    return NextResponse.json({ task: newTask }, { status: 201 });
  } catch (_) {
    return NextResponse.json({ message: 'Failed to create a task.' }, { status: 500 });
  }
}

// Get all tasks with caching
export async function GET() {
  try {
    const cacheKey = 'all_tasks';

    // Try fetching from cache
    const cachedTasks = await redis.get(cacheKey);
    if (cachedTasks) {
      console.log('Returning tasks from Redis cache');
      return NextResponse.json({ tasks: JSON.parse(cachedTasks) }, { status: 200 });
    }

    // If not cached, fetch from database
    const allTasks = await db.select().from(tasks);

    // Store the result in Redis and set an expiry time
    await redis.set(cacheKey, JSON.stringify(allTasks), 'EX', CACHE_EXPIRY);

    return NextResponse.json({ tasks: allTasks }, { status: 200 });
  } catch (_) {
    return NextResponse.json({ message: 'Failed to retrieve tasks.' }, { status: 500 });
  }
}
