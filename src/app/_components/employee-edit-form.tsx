"use client";

import Link from "next/link";
import { useEffect } from "react";
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
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  tel: z.string(),
  email: z.string(),
  manager: z.string(),
  status: z.enum(["Active", "Inactive"]),
});

export function EditForm({ id, type }: { id: string; type: string }) {
  const employee = api.employee.getEmployee.useQuery({ id }); // Define function
  const updateEmployee = api.employee.updateEmployee.useMutation(); // Define function
  const { data: managers } = api.employee.getManagers.useQuery();
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      id: id,
      firstName: "",
      lastName: "",
      tel: "",
      email: "",
      manager: "",
      status: "Active",
    },
  });

  const { reset } = form;

  // Effect to reset form when employee data is loaded
  useEffect(() => {
    if (employee.data) {
      reset({
        id: employee.data.id,
        firstName: employee.data.firstName || "",
        lastName: employee.data.lastName || "",
        tel: employee.data.tel || "",
        email: employee.data.email || "",
        manager: employee.data.manager || "",
        status: employee.data.status as "Active" | "Inactive",
      });
    }
  }, [employee.data, reset]); // Run effect when employee data changes

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await updateEmployee.mutateAsync(data);
      if (type === "admin") {
        router.push("/employees");
      } else {
        alert("Submitted!");
      }
    } catch (error) {
      console.error("Failed to edit employee:", error);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-6 p-8 bg-gray-50"
      >
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <FormLabel className="text-gray-700">Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="name"
                  {...field}
                  className="w-2/3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <FormLabel className="text-gray-700">Surname</FormLabel>
              <FormControl>
                <Input
                  placeholder="surname"
                  {...field}
                  className="w-2/3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <FormLabel className="text-gray-700">Telephone Number</FormLabel>
              <FormControl>
                <Input
                  placeholder="telephone number"
                  {...field}
                  className="w-2/3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <FormLabel className="text-gray-700">Email Address</FormLabel>
              <FormControl>
                <Input
                  placeholder="email"
                  {...field}
                  className="w-2/3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </FormControl>
            </FormItem>
          )}
        />
        {type === "admin" && (
          <>
            <FormField
              control={form.control}
              name="manager"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel className="text-gray-700">Manager</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    required
                  >
                    <FormControl>
                      <SelectTrigger className="border border-gray-300 bg-white text-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white border border-gray-300 rounded-md shadow-sm">
                      {managers?.map((manager) => (
                        <SelectItem key={manager.manager} value={manager.manager}>
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
                  <FormLabel className="text-gray-700">Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    required
                  >
                    <FormControl>
                      <SelectTrigger className="border border-gray-300 bg-white text-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white border border-gray-300 rounded-md shadow-sm">
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </>
        )}
        <Button className="bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500" type="submit">
          Save
        </Button>
      </form>
    </Form>
  );
}
