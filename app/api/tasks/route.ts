import { db } from "@/db/drizzle";
import { tasks } from "@/db/schemas/tasksSchema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId, title, description } = await req.json();

    if (!title) {
      return NextResponse.json(
        { message: "The title is required." },
        { status: 400 }
      );
    }
    if (!userId) {
      return NextResponse.json(
        { message: "The userId is required." },
        { status: 400 }
      );
    }

    // Insert the task into the database
    const [newTask] = await db
      .insert(tasks)
      .values({
        userId,
        title,
        description,
      })
      .returning();

    return NextResponse.json({ task: newTask }, { status: 201 });
  } catch (err) {
    console.error("Error creating task:", err);
    return NextResponse.json(
      { message: "Failed to create a task." },
      { status: 500 }
    );
  }
}

// Get all tasks with caching
export async function GET(req: NextRequest) {
  try {
    // const cacheKey = "all_tasks";

    // Try fetching from cache
    // const cachedTasks = await redis.get(cacheKey);
    // if (cachedTasks) {
    //   console.log('Returning tasks from Redis cache');
    //   return NextResponse.json({ tasks: JSON.parse(cachedTasks) }, { status: 200 });
    // }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query")?.toLowerCase();
    // If not cached, fetch from database
    const allTasks = await db.select().from(tasks);

    // filter tasks if a query is provided
    const filteredTasks = query
      ? allTasks.filter(
          (task) =>
            task.title.toLowerCase().includes(query.toLowerCase()) ||
            task?.description?.toLowerCase().includes(query.toLowerCase())
        )
      : allTasks;

    // Store the result in Redis and set an expiry time
    // await redis.set(cacheKey, JSON.stringify(allTasks), 'EX', CACHE_EXPIRY);

    return NextResponse.json({ tasks: filteredTasks }, { status: 200 });
  } catch (err) {
    console.error("Error fetching tasks:", err);
    return NextResponse.json(
      { message: "Failed to retrieve tasks." },
      { status: 500 }
    );
  }
}
