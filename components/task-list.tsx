"use client";

import { Task } from "@/constants/task-type";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDistance, format } from "date-fns";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Button } from "./ui/button";
import { deleteTask, editTask } from "@/actions/task-actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function TaskList({ tasks }: { tasks: Task[] }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div className="flex justify-center flex-wrap gap-4">
      {tasks.map((task: Task) => (
        <Card key={task.id} className="flex-1 min-w-[300px] max-w-[350px]">
          <CardHeader>
            <CardTitle>
              <div className="flex flex-row justify-between items-center">
                <h3 className="text-xl font-semibold leading-tight tracking-wide">
                  {task.title}
                </h3>

                <div className="flex gap-x-2 items-center">
                  <Dialog
                    onOpenChange={() => {
                      // Set initial values when dialog opens
                      setTitle(task.title);
                      setDescription(task.description || "");
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <FaEdit />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Edit Task</DialogTitle>
                        <DialogDescription>
                          Make changes to your task here. Click save when you're
                          done.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="title" className="text-right">
                            Title
                          </Label>
                          <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="description" className="text-right">
                            Description
                          </Label>
                          <Input
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="col-span-3"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          onClick={async () => {
                            await editTask(task.id, { title, description });
                          }}
                        >
                          Save changes
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button onClick={() => deleteTask(task.id)}>
                    <MdDelete />
                  </Button>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-normal">
            <p>{task.description}</p>
          </CardContent>
          <CardFooter className="text-gray-400 text-[10px] flex justify-between items-center space-x-4">
            <p>
              {formatDistance(task.createdAt, Date.now(), { addSuffix: true })}
            </p>
            <p>Last update: {format(task.updatedAt, "eeee, MMMM dd, yyyy")}</p>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
