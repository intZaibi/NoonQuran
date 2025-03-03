import { NextResponse } from "next/server";

export async function POST(req){
  const {formData} = await req.json();
  console.log(formData);

  return NextResponse.json({message: "Message recieved!"}, {status: 200})
}


export async function GET(req){

  return NextResponse.json({message: "Message recieved!"}, {status: 200})
}