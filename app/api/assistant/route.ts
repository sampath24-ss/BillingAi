import Groq from 'groq-sdk'
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

interface Data{
    id: number,
    Description: String,
    Price: number,
    Date: Date,
}

export async function GET(req: NextRequest, res: NextResponse) {
  try{
    const data:Data[]  = await prisma.bill.findMany()
    const prices = data.map(item => item.Price);
    const descriptions = data.map(item => item.Description);
    
    const combinedContent = descriptions.map((desc, index) => `${desc}: $${prices[index]}`).join('\n');

    const completion = await groq.chat.completions.create({
        messages: [{ role: "assistant", content: combinedContent }],
        model: "mixtral-8x7b-32768",
        temperature: 0.7,
        max_tokens: 2048,
        stream: false,
      });
      const response = completion.choices[0]?.message?.content || "Sorry, I couldn't generate a response";
      return NextResponse.json({
       response
      })
  }catch (error) {
    console.error('Error in chat route:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}