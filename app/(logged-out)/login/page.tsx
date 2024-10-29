"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/validation";
import { useForm } from "react-hook-form";
import {
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Card,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { loginWithCredentials } from "@/actions";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (data: z.infer<typeof loginSchema>) => {
    const response = await loginWithCredentials({
      email: data.email,
      password: data.password,
    });

    if (response?.error) {
      form.setError("root", {
        message: response.message,
      });
    } else {
      router.push("/my-account");
    }
  };

  const email = form.getValues("email");

  return (
    <main className="flex justify-center items-center h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-3xl text-center font-semibold">
            Log In
          </CardTitle>
          <CardDescription>Log in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <fieldset disabled={form.formState.isSubmitting}>
              <form
                onSubmit={form.handleSubmit(handleLogin)}
                className="space-y-3"
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
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
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
                  {form.formState.isSubmitting ? "Logging..." : "Log In"}
                </Button>
              </form>
            </fieldset>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col gap-y-2 text-xs items-start font-semibold">
          <div>
            Don&apos;t you have an account?{" "}
            <Link href="/register" className="underline">
              Register Now.
            </Link>
          </div>
          <div>
            Forgot your password?{" "}
            <Link
              href={`/reset-password${email ? `?email=${encodeURIComponent(email)}` : ""}`}
              className="underline"
            >
              Reset your password.
            </Link>
          </div>
        </CardFooter>
      </Card>
    </main>
  );
}
