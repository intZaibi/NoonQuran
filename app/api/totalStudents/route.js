import db from '@/utils/db'
import { NextResponse } from "next/server";

export async function GET() {

  try {
    
    const [students] = await db.query(`SELECT * FROM payments`);
    return NextResponse.json({ students }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
  }
}

export async function POST() {

  try {

    const [students] = await db.query(`SELECT * FROM payments`);
    return NextResponse.json({ students }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
  }
}
