"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { createTaskSchema } from "@/validation";
import { useToast } from "@/hooks/use-toast";
import { createTask } from "@/actions";

interface Props {
  userId: string;
}

export default function CreateForm({ userId }: Props) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof createTaskSchema>>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const handleCreate = async (data: z.infer<typeof createTaskSchema>) => {
    const response = await createTask({
      userId,
      title: data.title,
      description: data.description,
    });

    if (response?.error) {
      toast({
        title: "Failed to create task.",
        variant: "destructive",
      });
    } else {
      form.reset();
      toast({
        description: "Task created successfully.",
        className: "bg-green-500 text-white",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleCreate)}>
        <fieldset disabled={form.formState.isSubmitting} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.formState.errors.root?.message ?? (
            <FormMessage>{form.formState.errors.root?.message}</FormMessage>
          )}
          <Button type="submit" className="w-full">
            Create
          </Button>
        </fieldset>
      </form>
    </Form>
  );
}
