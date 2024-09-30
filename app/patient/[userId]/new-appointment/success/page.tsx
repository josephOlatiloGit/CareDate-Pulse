import { Doctors } from "@/constants";
import { getAppointment } from "@/lib/actions/appointment.actions";
import Image from "next/image";
import Link from "next/link";
import React from "react";

/**
 * Here we fetch the appointment Id throw the params;
 * Since we are dealing with a dynamic route.
 */

export default async function Success({
  params: { userId },
  searchParams,
}: SearchParamProps) {
  // TO get the appointment Id
  const appointmentId = (searchParams?.appointmentId as string) || "";
  const appointment = await getAppointment(appointmentId);
  const doctor = Doctors.find(
    (doc) => doc.name === appointment.primaryPhysician
  ); //get the primaryPhysician (Doctor)

  return (
    <div className="flex h-screen max-h-screen px-[5%]">
      <div className="success-img">
        <Link href="/">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="logo"
            className="h-10 w-fit"
          />
        </Link>
        <section className="flex flex-col items-center">
          <Image
            src="/assets/gifs/success.gif"
            width={200}
            height={300}
            alt="success"
          />
          <h2 className="header mb-6 max-w-[600px] text-center">
            Your <span className="text-green-500">appointment request</span> has
            been successfully submitted!
          </h2>
          <p>We will be in touch shortly to confirm.</p>
        </section>

        <section className="request-details">
          <p>Requested appointment details:</p>
          <div className="flex items-center gap-3">
            <Image
              src={doctor?.image!}
              alt="doctor"
              width={100}
              height={100}
              className="sze-6"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
