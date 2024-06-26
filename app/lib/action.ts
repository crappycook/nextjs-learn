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

  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }

  // Since you're updating the data displayed in the invoices route, you want to clear this cache and trigger a new request to the server
  revalidatePath(invoicesPath);
  // At this point, you also want to redirect the user back to the `/dashboard/invoices` page.
  redirect(invoicesPath);
}

// Use Zod to update the expected types
const UpdateInvoiceForm = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoiceForm.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  console.log(customerId, amount, status);

  const amountInCents = amount * 100;

  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Invoice.' }
  }
  revalidatePath('/dashboard/invoices');
}
