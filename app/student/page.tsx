import { BookOpenCheck, HandHelping } from "lucide-react";
import { StudentSessionForm } from "@/components/forms/student-session-form";
import { SiteHeader } from "@/components/layout/site-header";
import { Card } from "@/components/ui/card";
import { getStudentCatalog } from "@/lib/queries";

export default async function StudentEntryPage() {
  const catalog = await getStudentCatalog();

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-8 md:px-8 lg:flex-row">
        <Card className="flex-1 rounded-[36px] bg-linear-to-br from-white via-surface-muted to-peach/30">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-[24px] bg-primary/15 text-primary-strong">
            <BookOpenCheck className="h-7 w-7" />
          </div>
          <h1 className="mt-6 font-heading text-4xl font-semibold">
            Sebelum mulai, isi identitas dulu ya.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-8 text-foreground/75">
            Masukkan nama, pilih kategori, dan tentukan level belajar. Setelah
            itu kamu bisa langsung menyusun kalimat dengan cara klik atau drag
            and drop.
          </p>

          <div className="mt-8 space-y-4">
            {[
              "Tombol besar dan mudah ditekan",
              "Bisa melihat GIF bahasa isyarat saat butuh bantuan",
              "Mendapat skor dan rangkuman di akhir latihan",
            ].map((item) => (
              <div
                className="flex items-center gap-3 rounded-[22px] bg-white/80 px-4 py-4"
                key={item}
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-soft text-primary-strong">
                  <HandHelping className="h-5 w-5" />
                </span>
                <p className="text-sm font-bold md:text-base">{item}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="w-full rounded-[36px] lg:max-w-xl">
          <h2 className="font-heading text-3xl font-semibold">Ayo isi datanya</h2>
          <p className="mt-3 text-sm leading-7 text-foreground/75 md:text-base">
            Data ini dipakai untuk menyimpan hasil latihanmu.
          </p>
          <div className="mt-8">
            <StudentSessionForm catalog={catalog} />
          </div>
        </Card>
      </main>
    </div>
  );
}
