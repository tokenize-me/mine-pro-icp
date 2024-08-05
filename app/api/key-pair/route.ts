import * as ed from "@noble/ed25519"; // ESM-only. Use bundler for common.js
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const privateKey = ed.utils.randomPrivateKey(); // 32-byte Uint8Array or string
    const publicKey = await ed.getPublicKeyAsync(privateKey);

    // console.log("---------KEYS START---------");
    // console.log(`Private key: 0x${Buffer.from(privateKey).toString("hex")}`);
    // console.log(`Public key: 0x${Buffer.from(publicKey).toString("hex")}`);
    // console.log("---------KEYS END---------");

    return new NextResponse(
      JSON.stringify({
        privateKey: Buffer.from(privateKey).toString("hex"),
        publicKey: Buffer.from(publicKey).toString("hex"),
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    console.error("Error generating keys:", error);
    return new NextResponse(
      JSON.stringify({
        message: error,
      }),
      { status: 500 }
    );
  }
}
