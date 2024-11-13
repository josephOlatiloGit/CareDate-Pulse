import DataTable from "@/components/table/DataTable";
import StatCard from "@/components/StatCard";
import { getRecentAppointmentList } from "@/lib/actions/appointment.actions";
import Image from "next/image";
import Link from "next/link";
import { columns } from "@/components/table/Columns";
import { Appointment } from "@/types/appwrite.types";

export default async function Admin() {
  const appointments = await getRecentAppointmentList();

  // Provide default values in case appointments is undefined
  const scheduledCount = appointments?.scheduledCount ?? 0;
  const pendingCount = appointments?.pendingCount ?? 0;
  const cancelledCount = appointments?.cancelledCount ?? 0;
  const documents = appointments?.documents ?? [];

  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-14">
      <header className="admin-header z-10">
        <Link href="/" className="cursor-pointer">
          <Image
            src="/assets/icons/logo-full.svg"
            height={32}
            width={162}
            alt="logo"
            className="h-8 w-fit"
          />
        </Link>

        <p className="text-16-semibold"> Admin Dashboard</p>
      </header>

      <main className="admin-main">
        <section className="w-full space-y-4">
          <h1 className="header"> Welcome 👋</h1>
          <p className="text-dark-700">
            Start the day with managing new appointments
          </p>
        </section>

        <section className="admin-stat">
          <StatCard
            type="appointments"
            count={scheduledCount}
            label="Schedule appointments"
            icon="/assets/icons/appointments.svg"
          />

          <StatCard
            type="pending"
            count={pendingCount}
            label="Pending appointments"
            icon="/assets/icons/pending.svg"
          />

          <StatCard
            type="cancelled"
            count={cancelledCount}
            label="Cancelled appointments"
            icon="/assets/icons/cancelled.svg"
          />
        </section>
        <DataTable columns={columns} data={documents as Appointment[]} />
      </main>
    </div>
  );
}
