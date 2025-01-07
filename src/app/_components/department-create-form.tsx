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
  name: z.string(),
  manager: z.string(),
  status: z.enum(["Active", "Inactive"]),
});

export function CreateForm() {
  const router = useRouter();
  const createDepartment = api.department.createDepartment.useMutation(); // Define function
  const { data: managers } = api.employee.getManagers.useQuery();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      manager: "",
      status: undefined,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await createDepartment.mutateAsync(data);
      router.push("/departments");
    } catch (error) {
      console.error("Failed to create department:", error);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-6 p-8 bg-[#F5F5F5]"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <FormLabel className="text-[#4A4A4A]">Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="name"
                  {...field}
                  className="w-1/2 bg-white text-[#333333] border border-[#0A9396] focus:ring-[#0A9396] focus:border-[#0A9396]"
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
                  <SelectTrigger className="border border-[#0A9396] focus:ring-[#0A9396]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {managers?.map((manager) => (
                    <SelectItem
                      key={manager.manager}
                      value={manager.manager}
                      className="text-[#333333]"
                    >
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
                  <SelectTrigger className="border border-[#0A9396] focus:ring-[#0A9396]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Active" className="text-[#333333]">
                    Active
                  </SelectItem>
                  <SelectItem value="Inactive" className="text-[#333333]">
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
