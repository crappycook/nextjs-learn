'use server';

import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(), // type coercion: convert from a string to a number
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});

const CreateInvoiceForm = FormSchema.omit({ id: true, date: true });

const invoicesPath = '/dashboard/invoices';

export async function createInvoice(formData: FormData) {
  const rawFormData = {
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  };
  const { customerId, amount, status } = CreateInvoiceForm.parse(rawFormData)
  // Test it out:
  console.log(customerId, amount, status);
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;

  // Since you're updating the data displayed in the invoices route, you want to clear this cache and trigger a new request to the server
  revalidatePath(invoicesPath);
  // At this point, you also want to redirect the user back to the `/dashboard/invoices` page.
  redirect(invoicesPath);
}