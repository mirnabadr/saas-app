"use client"

import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { subjects } from "@/constants";
import { createCompanion } from "@/lib/actions/companion.actions";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  username: z.string().min(1, { message: "Companion is required." }),
  subject: z.string().min(1, { message: "Subject is required." }),
  topic: z.string().min(1, { message: "Topic is required." }),
  voice: z.string().min(1, { message: "Voice is required." }),
  style: z.string().min(1, { message: "Style is required." }),
  duration: z.number().min(1, { message: "Value must be greater than or equal to 1." })
});

type FormValues = z.infer<typeof formSchema>;

const CompanionForm = () => {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      subject: "",
      topic: "",
      voice: "",
      style: "",
      duration: 10,
    }
  });

  async function onSubmit(values: FormValues) {
    try {
      const companion = await createCompanion(values);
      if (companion) {
        router.push(`/companions/${companion.id}`);
      } else {
        console.log({ message: "Failed to create companion" });
        router.push('/');
      }
    } catch (error) {
      console.error("Error creating companion:", error);
      router.push('/');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full font-sans space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-left font-bold text-base mb-2 block">Companion name</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Enter the companion name" 
                  className="w-full h-12 rounded-none border border-gray-300 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 px-4 text-base font-bold" 
                />
              </FormControl>
              <FormMessage className="text-xs text-red-600 mt-1" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-left font-bold text-base mb-2 block">Subject</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="w-full h-12 rounded-none border border-gray-300 shadow-none focus:ring-0 focus:ring-offset-0 px-4 text-base font-bold capitalize">
                    <SelectValue placeholder="Select The Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} className="capitalize" value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage className="text-xs text-red-600 mt-1" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-left font-bold text-base mb-2 block">What should the companion help with?</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Ex. Derivates & Integrals" 
                  className="w-full min-h-[80px] rounded-none border border-gray-300 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 px-4 py-3 text-base font-bold" 
                />
              </FormControl>
              <FormMessage className="text-xs text-red-600 mt-1" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="voice"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-left font-bold text-base mb-2 block">Voice</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="w-full h-12 rounded-none border border-gray-300 shadow-none focus:ring-0 focus:ring-offset-0 px-4 text-base font-bold">
                    <SelectValue placeholder="Select the voice" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={"male.casual"}>Male Casual Voice</SelectItem>
                    <SelectItem value={"male.formal"}>Male formal voice</SelectItem>
                    <SelectItem value={"female.casual"}>Female Casual Voice</SelectItem>
                    <SelectItem value={"female.formal"}>Female formal voice</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage className="text-xs text-red-600 mt-1" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="style"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-left font-bold text-base mb-2 block">Style</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="w-full h-12 rounded-none border border-gray-300 shadow-none focus:ring-0 focus:ring-offset-0 px-4 text-base font-bold">
                    <SelectValue placeholder="Select the style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={"casual"}>Casual</SelectItem>
                    <SelectItem value={"formal"}>Formal</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage className="text-xs text-red-600 mt-1" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-left font-bold text-base mb-2 block">Estimated session duration in minutes</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="10" 
                  value={field.value && field.value > 0 ? field.value : ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "") {
                      field.onChange(0);
                    } else {
                      const numValue = Number(value);
                      if (!isNaN(numValue)) {
                        field.onChange(numValue);
                      }
                    }
                  }}
                  className="w-full h-12 rounded-none border border-gray-300 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 px-4 text-base font-bold" 
                  min={1} 
                  max={60} 
                />
              </FormControl>
              <FormMessage className="text-xs text-red-600 mt-1" />
            </FormItem>
          )}
        />  
        <div className="w-full mt-8 pb-4">
          <Button 
            type="submit" 
            className="w-full h-14 bg-black text-white rounded-none shadow-none hover:bg-black/90 font-bold text-lg"
          >
            Build Your Companion
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default CompanionForm;
