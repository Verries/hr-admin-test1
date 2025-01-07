import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";

export const departmentRouter = createTRPCRouter({
    updateStatus: publicProcedure
        .input(z.object({ id: z.string(), status: z.enum(['Active', 'Inactive']) }))
        .mutation(async ({ ctx, input }) => {
            const { id, status } = input;

            await ctx.db.department.update({
                where: { id },
                data: { status },
            })

            return { success: true }
        }),

    getAll: publicProcedure.query(async ({ ctx }) => {
        const departments = await ctx.db.department.findMany({
            orderBy: { name: "asc" },
        });

        return departments;
    }),

    createDepartment: publicProcedure
        .input(z.object({
            name: z.string(),
            manager: z.string(),
            status: z.enum(['Active', 'Inactive']),
        }))
        .mutation(async ({ ctx, input }) => {
            const { name, manager, status } = input;
            await ctx.db.department.create({
                data: { name, manager, status },
            })

            return { success: true }
        }),

        getDepartment: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            const { id } = input;

            const department = await ctx.db.department.findUnique({
                where: { id },
            })

            return department;
        }),

    updateDepartment: publicProcedure
        .input(z.object({
            id: z.string(),
            name: z.string(),
            manager: z.string(),
            status: z.enum(['Active', 'Inactive']),
        }))
        .mutation(async ({ ctx, input }) => {
            const { id, name, manager, status } = input;
            await ctx.db.department.update({
                where: { id },
                data: { name, manager, status },
            })

            return { success: true }
        }),
});
