"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CustomFormFiled from "../CustomFormFiled";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { PatientFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { createUser, registerPatient } from "@/lib/actions/patient.actions";
import { FormFieldType } from "./PatientForm";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Doctors,
  GenderOptions,
  IdentificationTypes,
  PatientFormDefaultValues,
} from "@/constants";
import { Label } from "../ui/label";
import { Select, SelectItem } from "../ui/select";
import Image from "next/image";
import FileUploader from "../FileUploader";

/**
 * Note: Here We make use of react-hook form to create a controlled form without using state.
 *  Here in this form component we will be using Shadcn for a general form
 * component Ui to maintain consistency within our app
 * We add the formSchema form Shadcn
 * We import {z} form zod and Zod is a validation library.
 * Then we copy the form component from the Shadcn guide.
 * To build the form we copy the components and install input.
 * Then we copy the actual form input code snippet.
 * Since we gonna be having a lots of form activity in our application , then we can turn the formField in to a reusable component.
 */

export default function RegisterForm({ user }: { user: User }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // 1. Define your form.
  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: "",
      email: "",
      phone: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
    setIsLoading(true);
    let formData;
    // To ensure the uploaded file is saved:
    if (
      values.identificationDocument &&
      values.identificationDocument.length > 0
    ) {
      const blobFile = new Blob([values.identificationDocument[0]], {
        type: values.identificationDocument[0].type,
      });

      formData = new FormData();
      formData.append("blobFile", blobFile);
      formData.append("filename", values.identificationDocument[0].name);
    }

    // Now we structure the data submission in a way that suits appwrite db
    try {
      const patientData = {
        ...values,
        userId: user.$id,
        birthDate: new Date(values.birthDate),
        identificationDocument: formData,
      };
      // @ts-ignore
      const patient = await registerPatient(patientData);
      if (patient) router.push(`patient/${user.$id}/new-appointment`);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-12 flex-1"
      >
        <section className=" space-y-4">
          <h1 className="header">Welcome 👋 </h1>
          <p className="text-dark-700">Let us know more about yourself.</p>
        </section>

        <section className=" space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Personal Information</h2>
          </div>
        </section>

        <CustomFormFiled
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="name"
          label="Full Name"
          placeholder="Your full name"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />

        <div className="flex flex-col gap-6 xl:flex-row ">
          <CustomFormFiled
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="email"
            label="Email"
            placeholder="joseph@developer.pro"
            iconSrc="/assets/icons/email.svg"
            iconAlt="email"
          />
          <CustomFormFiled
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name="phone"
            label="Phone number"
            placeholder="(0806) 1235-2243"
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormFiled
            fieldType={FormFieldType.DATE_PICKER}
            control={form.control}
            name="birthDate"
            label="Date of Birth"
          />
          <CustomFormFiled
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="gender"
            label="Gender"
            renderSkeleton={(field) => (
              <FormControl>
                <RadioGroup
                  className="flex h-11 gap-6 xl:justify-between"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  {GenderOptions.map((option) => (
                    <div key={option} className="radio-group">
                      <RadioGroupItem value={option} id={option} />
                      <Label className="cursor-pointer" htmlFor={option}>
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormFiled
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="address"
            label="Address"
            placeholder="14th Street, New York"
          />

          <CustomFormFiled
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="occupation"
            label="Occupation"
            placeholder="Software Engineer"
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormFiled
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="emergencyContactName"
            label="Emergency contact name"
            placeholder="Guardian's Name"
          />
          <CustomFormFiled
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name="emergencyContactNumber"
            label="Emergency contact number"
            placeholder="(0806) 1235-2243"
          />
        </div>

        <section className=" space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Medical Information</h2>
          </div>
        </section>

        <CustomFormFiled
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="primaryPhysician"
          label="Primary Physician"
          placeholder="Select a physician"
        >
          {Doctors.map((doctor) => (
            <SelectItem key={doctor.name} value={doctor.name}>
              <div className=" flex cursor-pointer items-center gap-2 ">
                <Image
                  src={doctor.image}
                  width={32}
                  height={32}
                  alt={doctor.name}
                  className="rounded-full border border-dark-500"
                />
                <p className="">{doctor.name}</p>
              </div>
            </SelectItem>
          ))}
        </CustomFormFiled>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormFiled
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="insuranceProvider"
            label="Insurance Provider"
            placeholder="BlueCross BlueShield"
          />
          <CustomFormFiled
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="insurancePolicyNumber"
            label="Insurance policy number"
            placeholder="ABC123456789"
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormFiled
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="allergies"
            label="Allergies (if any)"
            placeholder="Peanuts, Penicillin, Pollen"
          />
          <CustomFormFiled
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="currentMedication"
            label="Current medication (if any)"
            placeholder="Ibuprofen 200mg, Paracetamol 500mg"
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormFiled
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="familyMedicalHistory"
            label="Family medical history"
            placeholder="Mother had diabetes, Father had heart disease"
          />
          <CustomFormFiled
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="pastMedicalHistory"
            label="Past medical history"
            placeholder="Appendectomy, Tonsillectomy"
          />
        </div>

        <section className=" space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Identification and Verification </h2>
          </div>
        </section>

        <CustomFormFiled
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="identificationType"
          label="Identification type"
          placeholder="Select an identification type"
        >
          {IdentificationTypes.map((type) => (
            <SelectItem key={type} value={type} className="cursor-pointer">
              {type}
            </SelectItem>
          ))}
        </CustomFormFiled>

        <CustomFormFiled
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="identificationNumber"
          label="Identification number"
          placeholder="123456789"
        />

        <CustomFormFiled
          fieldType={FormFieldType.SKELETON}
          control={form.control}
          name="identificationDocument"
          label="Scanned copy of identification document"
          renderSkeleton={(field) => (
            <FormControl>
              <FileUploader files={field.value} onChange={field.onChange} />
            </FormControl>
          )}
        />

        <section className=" space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Consent and Privacy</h2>
          </div>
        </section>

        <CustomFormFiled
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="treatmentConsent"
          label="I consent to treatment"
        />
        <CustomFormFiled
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="disclosureConsent"
          label="I consent to disclosure of information"
        />
        <CustomFormFiled
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="privacyConsent"
          label="I consent to privacy policy"
        />

        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  );
}
