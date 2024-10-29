import { db } from "@/db/drizzle";
import { tasks } from "@/db/schemas/tasksSchema";
import { users } from "@/db/schemas/usersSchema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    // Check whether the exists
    const userId = params.userId;
    console.log(userId)
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));
    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 400 });
    }

    const [usersTasks] = await db
      .select()
      .from(tasks)
      .where(eq(tasks.userId, userId));

    return NextResponse.json({ tasks: usersTasks }, { status: 200 });
  } catch (_) {
    return NextResponse.json(
      { message: "Failed to fetch users's tasks." },
      { status: 500 }
    );
  }
}
