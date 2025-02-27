import db from '@/utils/db.js'
import { NextResponse } from 'next/server';

export async function POST(req) {
  const {formData} = await req.json();
  try {

    if (formData.role === 'sibling') {
      await db.query(`UPDATE siblings SET name = ?, gender = ?, age = ?, course = ? WHERE idempotencyKey = ? AND id = ?`, 
                [
                formData.name,
                formData.gender,
                formData.age,
                formData.course,
                formData.idempotencyKey,
                formData.id
                ])
    } else {
      
      await db.query(`UPDATE payments SET name = ?, email = ?, whatsapp_no = ?, phone = ?, skype_id = ?, guardian_name = ?, gender = ?, age = ?, language = ?, class_time = ?, course = ?, payment_status = ? WHERE idempotencyKey = ? AND id = ?`, 
        [
        formData.name,
        formData.email,
        formData.whatsapp_no,
        formData.phone,
        formData.skype_id,
        formData.guardian_name,
        formData.gender,
        formData.age,
        formData.language,
        formData.class_time,
        formData.course,
        formData.payment_status,
        formData.idempotencyKey,
        formData.id
        ]);
    }

      return NextResponse.json({ message: "Update successful!" }, { status: 200 });

      } catch (error) {

        console.log('error updating data: ', error);
        return NextResponse.json({ error }, { status: 500 });

      }
}