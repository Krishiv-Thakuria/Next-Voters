import classifyPoliticalConcepts from '@/lib/email-service/classify-political-concepts';
import { NextResponse } from 'next/server';

export const GET = async () => {
  const response = await classifyPoliticalConcepts("Increase taxes for the poor!");
  console.log(response)
  return NextResponse.json({
    message: 'success'
  });
}
