import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./ui/button";
import CreateTaskForm from "./create-task-form";
import { Session } from "next-auth";

export default function CreateTaskPopover({ session }: { session: Session }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="h-[60px] rounded-full">Create a new task</Button>
      </PopoverTrigger>
      <PopoverContent className="md:w-[450px] mt-4 mr-4">
        <CreateTaskForm userId={session?.user?.id!} />
      </PopoverContent>
    </Popover>
  );
}
