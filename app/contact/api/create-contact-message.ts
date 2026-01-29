import {ContactFormData} from "@/app/contact/contact-form";
import {api} from "@/lib/api";

export async function createContactMessage(formData: ContactFormData ) {
  try {
    await api.post('contacts', {data: formData})
  } catch (e) {
    console.error(e);
    const message = e instanceof Error ? e.message : 'Unknown error';
    throw new Error(message);
  }
}