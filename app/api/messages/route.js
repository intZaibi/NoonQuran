import db from '@/utils/db';
import { NextResponse } from "next/server";

export async function POST(req){
  const {formData} = await req.json();
  console.log(formData);
  try{

    await db.query('INSERT INTO messages (name, email, whatsapp, message) VALUES (?, ?, ?, ?)', [
      formData.name, formData.email, formData.whatsapp, formData.message
    ]);
  } catch(err) {

    console.log('Error inserting messages: ', err)
    return NextResponse.json({Error: 'Something went wrong!'}, {status: 500})
  }

  return NextResponse.json({message: "Message recieved!"}, {status: 200})
}


export async function GET(){
  try {
    
    const messages = await db.query('SELECT * FROM messages ORDER BY id DESC');
    return NextResponse.json({ messages: messages[0] }, {status: 200})
  } catch (error) {
    
    console.log('Error retrieving messages: ', error);
    return NextResponse.json({Error: "Something went wrong!"}, {status: 500})
  }
}

export async function DELETE(req) {
  const {id} = await req.json();
  
  try {
    
    await db.query('DELETE FROM messages WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Deleted Successfully!'}, {status: 200})
  } catch (error) {
    
    console.log('Error deleting message: ', error);
    return NextResponse.json({Error: "Something went wrong!"}, {status: 500})
  }

}