# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Drizzle](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.

This is the T3 stack web app for HR System How to run this project:

run in terminal this:
npm create t3-app@latest hr-admin_test
Choose typescript, prisma, nextAuth, tailwind,tRPC,Next.js,SQLite and git
Copy the schema.prisma file and paste it into yours
run in termenal npx prisma generate
the db.sqlite is the database name make sure yours is the same
run in terminal: npx prisma migrate dev --name init
run in terminal: npx prisma studio
create hradmin@test.com in email and $2a$12$ktJHW2ECPsUxEMCXjPSgBe8vD0ofI5GrODleUe9mZXuSOazD5h12K in password ( this is TestPass123 for password) and type as admin
create manager@test.com with a bcrypt encrypted password using bcrypt and type as manager
copy all files as the same as mine and make sure to npm install every import that I have
npm run dev to run the program
there is still errors but it works as I showed you.
