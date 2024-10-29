"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormMessage,
  FormControl,
  FormItem,
  FormLabel,
} from "./ui/form";
import { passwordMatchSchema } from "@/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useToast } from "@/hooks/use-toast";
import { updatePassword } from "@/actions/updatePassword";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Link from "next/link";

interface Props {
  token: string;
}

export default function PasswordUpdateForm({ token }: Props) {
  const form = useForm<z.infer<typeof passwordMatchSchema>>({
    resolver: zodResolver(passwordMatchSchema),
    defaultValues: {
      password: "",
      passwordConfirm: "",
    },
  });
  const { toast } = useToast();

  const handleUpdatePassword = async (
    data: z.infer<typeof passwordMatchSchema>
  ) => {
    const response = await updatePassword({
      password: data.password,
      passwordConfirm: data.passwordConfirm,
      token: token!,
    });

    if (response?.message) {
      window.location.reload();
    }

    if (response?.error) {
      form.setError("root", {
        message: response.message,
      });
    } else {
      form.reset();
      toast({
        title: "Password update",
        description: "Your password has updated",
        className: "bg-green-500 text-white",
      });
    }
  };

  return form.formState.isSubmitSuccessful ? (
    <Card>
      <CardHeader>
        <CardTitle>Password updated</CardTitle>
      </CardHeader>
      <CardContent>
        <Link href="/login">Click here to log in to your account</Link>
      </CardContent>
    </Card>
  ) : (
    <Form {...form}>
      <fieldset disabled={form.formState.isSubmitting}>
        <form
          onSubmit={form.handleSubmit(handleUpdatePassword)}
          className="space-y-3"
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="passwordConfirm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {form?.formState?.errors?.root?.message && (
            <FormMessage>{form.formState.errors.root.message}</FormMessage>
          )}
          <Button type="submit" className="w-full">
            {form.formState.isSubmitting ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </fieldset>
    </Form>
  );
}
