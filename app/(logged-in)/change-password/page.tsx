"use client";

import { changePassword } from "@/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormField,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { changePasswordSchema } from "@/validation/changePasswordSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function ChangePasswordPage() {
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const handleChangePassword = async (
    data: z.infer<typeof changePasswordSchema>
  ) => {
    const response = await changePassword({
      currentPassword: data.currentPassword,
      password: data.password,
      passwordConfirm: data.passwordConfirm,
    });

    if (response?.error) {
      form.setError("root", {
        message: response.message,
      });
    } else {
      form.reset();
      toast({
        title: "Change password",
        description: "Your password has been changed.",
        className: "bg-green-500 text-white",
      });
    }
  };

  return (
    <main className="">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-3xl text-center font-semibold">
            Change Password
          </CardTitle>
          <CardDescription>Change the current password.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <fieldset disabled={form.formState.isSubmitting}>
              <form
                onSubmit={form.handleSubmit(handleChangePassword)}
                className="space-y-3"
              >
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                  <FormMessage>
                    {form.formState.errors.root.message}
                  </FormMessage>
                )}
                <Button type="submit" className="w-full">
                  {form.formState.isSubmitting ? "Changing..." : "Change Now"}
                </Button>
              </form>
            </fieldset>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
