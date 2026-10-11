import { adminProcedure, createTRPCRouter } from "~/server/api/trpc";

export const adminRouter = createTRPCRouter({
    users: adminProcedure.query(({ ctx }) =>
        ctx.db.query.user.findMany({
            columns: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true,
            },
            orderBy: (user, { asc }) => [asc(user.name)],
        }),
    ),
});
