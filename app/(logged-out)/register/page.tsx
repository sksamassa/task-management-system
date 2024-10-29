"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/validation";
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
import Link from "next/link";
import { registerUser } from "@/actions";

export default function RegisterPage() {
  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const handleRegister = async (data: z.infer<typeof registerSchema>) => {
    const response = await registerUser({
      email: data.email,
      password: data.password,
      passwordConfirm: data.passwordConfirm,
    });

    if (response?.error) {
      form.setError("root", {
        message: response.message,
      });
    }
  };

  return (
    <main className="flex justify-center items-center h-screen">
      {form.formState.isSubmitSuccessful ? (
        <Card className="w-[300px] space-y-4">
          <CardHeader>
            <CardTitle>Your account has been created</CardTitle>
            <CardContent>
              <Button asChild>
                <Link className="underline w-full" href="/login">
                  Log in to your account
                </Link>
              </Button>
            </CardContent>
          </CardHeader>
        </Card>
      ) : (
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle className="text-3xl text-center font-semibold">
              Register
            </CardTitle>
            <CardDescription>
              Create a new account with your email address.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <fieldset disabled={form.formState.isSubmitting}>
                <form
                  onSubmit={form.handleSubmit(handleRegister)}
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
                  <FormField
                    control={form.control}
                    name="passwordConfirm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
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
                    {form.formState.isSubmitting
                      ? "Registering..."
                      : "Register"}
                  </Button>
                </form>
              </fieldset>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col gap-y-2 text-xs items-start font-semibold">
            <div>
              Already have an account?{' '}
              <Link href="/register" className="underline">
                Log In.
              </Link>
            </div>
            <div>
              Forgot your password?{' '}
              <Link href="/reset-password" className="underline">
                Reset your password.
              </Link>
            </div>
          </CardFooter>
        </Card>
      )}
    </main>
  );
}
