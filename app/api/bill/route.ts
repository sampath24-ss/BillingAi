import { PrismaClient } from '@prisma/client'
import { error } from 'console';
import { NextRequest, NextResponse } from 'next/server';
const prisma = new PrismaClient();

function ParseDate(dateString){
    const months = {
        January: 'Jan', February: 'Feb', March: 'Mar', April: 'Apr', May: 'May', June: 'Jun',
        July: 'Jul', August: 'Aug', September: 'Sep', October: 'Oct', November: 'Nov', December: 'Dec'
      };
      const [day, monthName, year] = dateString.split(' ');
      const monthAbbrevation = months[monthName];

      if(!monthAbbrevation){
        throw new Error('Invalid month name');
      }

        const standardizedDateString = `${day} ${monthAbbrevation} ${year}`;
        const date = new Date(standardizedDateString);
        if (isNaN(date.getTime())) {
            throw new Error('Invalid date format');
        }
    return date;


    }

export async function GET(){
   const bills = await prisma.bill.findMany();

   return NextResponse.json({
    bills
   })
}

export async function POST(req: NextRequest){
    const { Price, Date: inputDate, Description } = await req.json();
    
    const parsedDate = ParseDate(inputDate); 
    const billings =  await prisma.bill.create({
      data: {
        Price: Price,
        Date: parsedDate, 
        Description: Description,
      }
    });

   return  NextResponse.json({
        msg: billings
    });
}