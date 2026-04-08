import { KeyRound, UserRound } from "lucide-react";
import { TeacherProfileForm } from "@/components/forms/teacher-profile-form";
import { Card } from "@/components/ui/card";
import { requireTeacherProfile } from "@/lib/auth";
import { formatDate } from "@/lib/utils";

export default async function AdminProfilePage() {
  const profile = await requireTeacherProfile();

  return (
    <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
      <Card className="rounded-[32px] bg-linear-to-br from-white via-surface-muted to-sky/35">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-[24px] bg-primary/15 text-primary-strong">
          <UserRound className="h-7 w-7" />
        </div>
        <h2 className="mt-6 font-heading text-4xl font-semibold">
          Profil guru
        </h2>
        <p className="mt-4 text-base leading-8 text-foreground/75">
          Ubah nama lengkap yang tampil di dashboard dan perbarui password akun
          jika dibutuhkan.
        </p>

        <div className="mt-8 space-y-4">
          <div className="rounded-[24px] bg-white/80 p-4">
            <p className="text-sm font-bold text-primary-strong">Email login</p>
            <p className="mt-2 font-bold">{profile.email}</p>
          </div>
          <div className="rounded-[24px] bg-white/80 p-4">
            <p className="text-sm font-bold text-primary-strong">Peran akun</p>
            <p className="mt-2 font-bold uppercase">{profile.role}</p>
          </div>
          <div className="rounded-[24px] bg-white/80 p-4">
            <p className="text-sm font-bold text-primary-strong">Akun dibuat</p>
            <p className="mt-2 font-bold">{formatDate(profile.created_at)}</p>
          </div>
        </div>
      </Card>

      <Card className="rounded-[32px]">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary-strong">
            <KeyRound className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-heading text-3xl font-semibold">Edit data akun</h2>
            <p className="text-sm text-foreground/70">
              Perubahan akan langsung digunakan di dashboard ini.
            </p>
          </div>
        </div>

        <TeacherProfileForm profile={profile} />
      </Card>
    </div>
  );
}
