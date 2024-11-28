import { Hono } from "hono";
import { verify } from "hono/jwt";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { createPostInput, updatePostInput } from "@sidd9101/medium-common";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: any;
  };
}>();

blogRouter.use("/*", async (c, next) => {
  const header = c.req.header("authorization");
  if (!header || !header.startsWith("Bearer")) {
    return c.json(
      {
        msg: "unauthorized",
      },
      403
    );
  }

  const token = header.split(" ")[1];

  try {
    const response = await verify(token, c.env.JWT_SECRET);
    if (response) {
      try {
        c.set("userId", response.id);
      } catch (error) {
        console.log(error);
      }
      await next();
    } else {
      return c.json(
        {
          msg: "Unauthorized",
        },
        401
      );
    }
  } catch (error) {
    return c.json(
      {
        msg: "Unauthorized",
      },
      401
    );
  }
});

blogRouter.post("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const userId = c.get("userId");

  try {
    const { success } = createPostInput.safeParse(body);

    if (!success) {
      return c.json(
        {
          message: "Wrong inputs",
        },
        411
      );
    }
  } catch (error) {
    console.log(error);
    return c.json(
      {
        message: "Wrong inputs",
      },
      411
    );
  }

  try {
    const post = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: userId,
      },
      select: {
        id: true,
      },
    });
    return c.json(
      {
        postId: post,
      },
      201
    );
  } catch (error) {
    console.log(error);
    return c.json({ error }, 500);
  } finally {
    await prisma.$disconnect();
  }
});

blogRouter.put("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const userId = c.get("userId");

  try {
    const { success } = updatePostInput.safeParse(body);

    if (!success) {
      return c.json(
        {
          message: "Wrong inputs",
        },
        411
      );
    }
  } catch (error) {
    console.log(error);
    return c.json(
      {
        message: "Wrong inputs",
      },
      411
    );
  }

  try {
    const updatedPost = await prisma.post.update({
      where: {
        id: body.id,
        authorId: userId,
      },
      data: {
        title: body.title,
        content: body.content,
        published: body.published,
      },
      select: { id: true },
    });

    return c.json({ postId: updatedPost }, 200);
  } catch (error) {
    console.log(error);
    return c.json({ error }, 500);
  } finally {
    await prisma.$disconnect();
  }
});

blogRouter.get("/get/:id", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const id = c.req.param("id");

  try {
    const post = await prisma.post.findFirst({
      where: { id },
    });

    return c.json({ post }, 200);
  } catch (error) {
    console.log(error);
    return c.json({ error }, 500);
  } finally {
    await prisma.$disconnect();
  }
});

blogRouter.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const posts = await prisma.post.findMany();
    return c.json({ posts }, 200);
  } catch (error) {
    console.log(error);
    return c.json({ error }, 500);
  } finally {
    await prisma.$disconnect();
  }
});
