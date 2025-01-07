import { z } from "zod";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from "bcrypt";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";

export const employeeRouter = createTRPCRouter({
    updateStatus: publicProcedure
        .input(z.object({ id: z.string(), status: z.enum(['Active', 'Inactive']) }))
        .mutation(async ({ ctx, input }) => {
            const { id, status } = input;

            await ctx.db.employee.update({
                where: { id },
                data: { status },
            })

            return { success: true }
        }),

    getAll: publicProcedure.query(async ({ ctx }) => {
        const employees = await ctx.db.employee.findMany({
            orderBy: { firstName: "asc" },
        });

        return employees;
    }),

    createEmployee: publicProcedure
        .input(z.object({
            firstName: z.string(),
            lastName: z.string(),
            tel: z.string(),
            email: z.string(),
            manager: z.string(),
            status: z.enum(['Active', 'Inactive']),
        }))
        .mutation(async ({ ctx, input }) => {
            const { firstName, lastName, tel, email, manager, status } = input;

            // Generate a common unique ID for both employee and user
            const commonId = uuidv4();
            const password = await bcrypt.hash("Password123#", 10) // Default password

            await ctx.db.employee.create({
                data: { id: commonId, firstName, lastName, tel, email, manager, status },
            })
            await ctx.db.user.create({
                data: { id: commonId, name: `${firstName} ${lastName}`, email: email, password: password, type: "employee" },
            })

            return { success: true }
        }),

    getEmployee: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            const { id } = input;

            const employee = await ctx.db.employee.findUnique({
                where: { id },
            })

            return employee;
        }),

    updateEmployee: publicProcedure
        .input(z.object({
            id: z.string(),
            firstName: z.string(),
            lastName: z.string(),
            tel: z.string(),
            email: z.string(),
            manager: z.string(),
            status: z.enum(['Active', 'Inactive']),
        }))
        .mutation(async ({ ctx, input }) => {
            const { id, firstName, lastName, tel, email, manager, status } = input;
            // Get managers old name
            const oldManager = await ctx.db.employee.findUnique({
                where: { id },
            });
            const oldManagerName = oldManager?.firstName;

            await ctx.db.employee.updateMany({
                where: { manager: oldManagerName },
                data: { manager: firstName }
            })
            await ctx.db.employee.update({
                where: { id },
                data: { firstName, lastName, tel, email, manager: manager === oldManagerName ? firstName : manager, status },
            })
            await ctx.db.user.update({
                where: { id },
                data: { name: `${firstName} ${lastName}`, email },
            })
            await ctx.db.department.updateMany({
                where: { manager: oldManagerName },
                data: { manager: firstName }
            })

            return { success: true }
        }),

    getManagers: publicProcedure.query(async ({ ctx }) => {
        try {
            const managers = await ctx.db.employee.findMany({
                select: { manager: true },  // Ensure you're selecting the 'manager' field
                distinct: ["manager"],      // Use distinct to fetch unique managers
                orderBy: { manager: "asc" },
            });

            return managers;
        } catch (error) {
            console.error("Error fetching managers:", error);   // Error log
            throw new Error("Failed to fetch managers");
        }
    }),
});

