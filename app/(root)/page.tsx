import CreateTaskPopover from "@/components/create-tast-popover";
import SearchBar from "@/components/search-bar";
import TaskList from "@/components/task-list";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { getTasks } from "@/lib/getTasks";
import Link from "next/link";
import { Suspense } from "react";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const session = await auth();
  const query = (await searchParams).query ?? "";

  const data = await getTasks(query);

  return (
    <div>
      <div className="flex flex-row justify-between items-center gap-x-4">
        <SearchBar query={query} />
        <div>
          {!session?.user?.id ? (
            <Button asChild className="h-[60px] rounded-full">
              <Link href="/login">Get Started</Link>
            </Button>
          ) : (
            <CreateTaskPopover session={session} />
          )}
        </div>
      </div>

      <h3 className="text-2xl font-semibold my-2">
        Search results for <b>{query}</b>
      </h3>
      <div className="mt-4">
        <h1 className="my-2 text-3xl font-bold tracking-widest">Your tasks</h1>
        <Suspense fallback={<p>Loading...</p>}>
          <TaskList tasks={data} />
        </Suspense>
      </div>
    </div>
  );
}
