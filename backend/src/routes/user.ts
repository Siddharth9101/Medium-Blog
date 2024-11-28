import { Hono } from "hono";
import { sign } from "hono/jwt";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { signupInput, signinInput } from "@sidd9101/medium-common";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

userRouter.post("/signup", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  async function hashPassword(password: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);

    // Use SHA-256 to hash the password
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);

    // Convert hash to hexadecimal string
    return Array.from(new Uint8Array(hashBuffer))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  }

  const body = await c.req.json();

  try {
    const { success } = signupInput.safeParse(body);

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

  const hashedPassword = await hashPassword(body.password);

  try {
    const createdUser = await prisma.user.create({
      data: {
        email: body.email,
        name: body.name,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    const token = await sign(createdUser, c.env.JWT_SECRET);
    return c.json(
      {
        accessToken: token,
      },
      201
    );
  } catch (error) {
    console.log(error);
    return c.json({ error }, 500);
  } finally {
    prisma.$disconnect();
  }
});

userRouter.post("/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();

  try {
    const { success } = signinInput.safeParse(body);

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

  async function hashPassword(password: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);

    // Use SHA-256 to hash the password
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);

    // Convert hash to hexadecimal string
    return Array.from(new Uint8Array(hashBuffer))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!user) {
      return c.json(
        {
          msg: "User not found",
        },
        404
      );
    }

    const hashedPassword = await hashPassword(body.password);
    if (hashedPassword !== user.password) {
      return c.json(
        {
          msg: "Wrong credentials",
        },
        401
      );
    }

    const token = await sign(
      { id: user.id, name: user.name, email: user.email },
      c.env.JWT_SECRET
    );

    return c.json(
      {
        accessToken: token,
      },
      200
    );
  } catch (error) {
    console.log(error);
    return c.json({ error }, 500);
  } finally {
    prisma.$disconnect();
  }
});
