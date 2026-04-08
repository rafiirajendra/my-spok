import Link from "next/link";
import { logoutAction } from "@/actions/auth";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { SubmitButton } from "@/components/ui/submit-button";
import { getCurrentProfile } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-5 py-6 md:px-8 lg:grid lg:grid-cols-[280px_1fr]">
      <div className="space-y-4">
        <Link
          className="inline-flex h-12 items-center rounded-full bg-white px-5 font-bold text-foreground card-shadow"
          href="/"
        >
          Kembali ke Beranda
        </Link>
        <AdminSidebar />
      </div>

      <div className="space-y-6">
        <div className="card-shadow rounded-[32px] border border-white/70 bg-white/85 p-5 backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-primary-strong">Halo, {profile?.full_name ?? "Guru"}</p>
              <h1 className="font-heading text-3xl font-semibold">Dashboard pengelolaan belajar</h1>
            </div>

            <form action={logoutAction}>
              <SubmitButton
                className="gap-2"
                label="Keluar"
                pendingLabel="Keluar..."
                variant="secondary"
              />
            </form>
          </div>
        </div>

        {children}
      </div>
    </main>
  );
}
