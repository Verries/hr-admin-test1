"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";

const FormSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  tel: z.string(),
  email: z.string(),
  manager: z.string(),
  status: z.enum(["Active", "Inactive"]),
});

export function CreateForm() {
  const router = useRouter();
  const createEmployee = api.employee.createEmployee.useMutation(); // Define function
  const { data: managers } = api.employee.getManagers.useQuery();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      tel: "",
      email: "",
      manager: "",
      status: undefined,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await createEmployee.mutateAsync(data);
      router.push("/employees");
    } catch (error) {
      console.error("Failed to create employee:", error);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-6 p-8 bg-[#F5F5F5] rounded-lg shadow-md"
      >
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <FormLabel className="text-[#4A4A4A]">First Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="First name"
                  {...field}
                  className="w-2/3 bg-white text-[#333333] border border-[#0A9396] focus:ring-[#0A9396] focus:border-[#0A9396]"
                  required
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <FormLabel className="text-[#4A4A4A]">Surname</FormLabel>
              <FormControl>
                <Input
                  placeholder="Surname"
                  {...field}
                  className="w-2/3 bg-white text-[#333333] border border-[#0A9396] focus:ring-[#0A9396] focus:border-[#0A9396]"
                  required
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tel"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <FormLabel className="text-[#4A4A4A]">Telephone Number</FormLabel>
              <FormControl>
                <Input
                  placeholder="Telephone number"
                  {...field}
                  className="w-2/3 bg-white text-[#333333] border border-[#0A9396] focus:ring-[#0A9396] focus:border-[#0A9396]"
                  required
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <FormLabel className="text-[#4A4A4A]">Email Address</FormLabel>
              <FormControl>
                <Input
                  placeholder="Email"
                  {...field}
                  className="w-2/3 bg-white text-[#333333] border border-[#0A9396] focus:ring-[#0A9396] focus:border-[#0A9396]"
                  required
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="manager"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <FormLabel className="text-[#4A4A4A]">Manager</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                required
              >
                <FormControl>
                  <SelectTrigger className="bg-white border-[#0A9396] focus:ring-[#0A9396]">
                    <SelectValue placeholder="Select Manager" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {managers?.map((manager) => (
                    <SelectItem key={manager.manager} value={manager.manager} className="text-[#333333]">
                      {manager.manager}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <FormLabel className="text-[#4A4A4A]">Status</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                required
              >
                <FormControl>
                  <SelectTrigger className="bg-white border-[#0A9396] focus:ring-[#0A9396]">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Active" className="text-[#0A9396]">
                    Active
                  </SelectItem>
                  <SelectItem value="Inactive" className="text-[#9C1C1C]">
                    Inactive
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="bg-[#0A9396] hover:bg-[#005F73] text-white"
        >
          Save
        </Button>
      </form>
    </Form>
  );
}
