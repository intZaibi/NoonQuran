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

export async function DELETE(req) {
  const {id} = await req.json();
  
  try {
    
    await db.query('DELETE FROM siblings WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Deleted Successfully!'}, {status: 200})
  } catch (error) {
    
    console.log('Error deleting sibling: ', error);
    return NextResponse.json({Error: "Something went wrong!"}, {status: 500})
  }

}