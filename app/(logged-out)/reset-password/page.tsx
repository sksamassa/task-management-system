"use client";

import { resetPassword } from "@/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email(),
});

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: decodeURIComponent(searchParams.get("email")! ?? ""),
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    await resetPassword(data.email);
  };

  return (
    <main className="flex flex-row justify-center items-center min-h-screen">
      {form.formState.isSubmitSuccessful ? (
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>E-mail Sent</CardTitle>
          </CardHeader>
          <CardContent>
            If you have an account with us you should receive a password reset
            email at {form.getValues("email")}
          </CardContent>
        </Card>
      ) : (
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Password Reset</CardTitle>
            <CardDescription>
              Enter your email address to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <fieldset
                  disabled={form.formState.isSubmitting}
                  className="flex flex-col gap-2"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {!!form.formState.errors.root?.message && (
                    <FormMessage>
                      {form.formState.errors.root.message}
                    </FormMessage>
                  )}
                  <Button type="submit" className="w-full">
                    {form.formState.isSubmitting
                      ? "Resetting..."
                      : "Reset Password"}
                  </Button>
                </fieldset>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 items-start">
            <div className="text-muted-foreground text-sm">
              Remember your account?{" "}
              <Link href="/login" className="underline">
                Log In
              </Link>
            </div>
            <div className="text-muted-foreground text-sm">
              Don&apos;t you have an account?{" "}
              <Link href="/register" className="underline">
                Register
              </Link>
            </div>
          </CardFooter>
        </Card>
      )}
    </main>
  );
}
