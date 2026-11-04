import { NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";

export const dynamic = "force-dynamic";

/**
 * Emergency Admin Recovery Endpoint
 *
 * Protected strictly by PAYLOAD_SECRET.
 * GET: Lists registered admin user emails (no passwords shown).
 * POST: Resets an admin's password or creates a new admin user.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  const expectedSecret = process.env.PAYLOAD_SECRET;
  if (!expectedSecret || secret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized. Valid secret required." }, { status: 401 });
  }

  try {
    const payload = await getPayload({ config: configPromise });
    const users = await payload.find({
      collection: "users",
      limit: 10,
    });

    return NextResponse.json({
      success: true,
      users: users.docs.map((u) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role,
        createdAt: u.createdAt,
      })),
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { secret, email, newPassword, name } = body;

    const expectedSecret = process.env.PAYLOAD_SECRET;
    if (!expectedSecret || secret !== expectedSecret) {
      return NextResponse.json({ error: "Unauthorized. Valid secret required." }, { status: 401 });
    }

    if (!email || !newPassword) {
      return NextResponse.json({ error: "Email and newPassword are required." }, { status: 400 });
    }

    const payload = await getPayload({ config: configPromise });

    // Check if user already exists
    const existing = await payload.find({
      collection: "users",
      where: {
        email: {
          equals: email,
        },
      },
    });

    if (existing.docs.length > 0) {
      const user = existing.docs[0];
      await payload.update({
        collection: "users",
        id: user.id,
        data: {
          password: newPassword,
        },
      });
      return NextResponse.json({
        success: true,
        message: `Password for ${email} has been successfully updated!`,
      });
    } else {
      // Create admin user
      await payload.create({
        collection: "users",
        data: {
          email,
          password: newPassword,
          name: name || "Lokesh Rohilla",
          role: "admin",
        },
      });
      return NextResponse.json({
        success: true,
        message: `New admin user ${email} has been successfully created!`,
      });
    }
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
