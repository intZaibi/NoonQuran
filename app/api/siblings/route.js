import db from '@/utils/db'
import { NextResponse } from "next/server";

export async function GET() {

  try {
    const [siblings] = await db.query(`SELECT * FROM siblings`);
    // console.log(siblings)

    return NextResponse.json({ siblings }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
  }
}