import Link from "next/link";
import { ArrowRight, HeartHandshake, Puzzle, Sparkles, Star } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const features = [
  {
    title: "Latihan drag and drop",
    description: "Siswa bisa menyusun kata jadi kalimat dengan cara yang menyenangkan.",
    icon: Puzzle,
    tone: "from-primary/20 to-peach/30",
  },
  {
    title: "Mode klik yang mudah",
    description: "Selain seret, kata juga bisa dipilih dengan klik agar lebih aksesibel.",
    icon: Sparkles,
    tone: "from-secondary/20 to-sky/30",
  },
  {
    title: "GIF bahasa isyarat",
    description: "Setiap kata dapat dibuka untuk melihat bantuan visual yang lebih jelas.",
    icon: HeartHandshake,
    tone: "from-peach/30 to-primary/20",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-5 py-8 md:px-8 md:py-10">
        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative overflow-hidden rounded-[36px] border border-white/70 bg-linear-to-br from-white via-surface-muted to-sky/35 p-7 card-shadow md:p-10">
            <div className="blob absolute -left-10 top-8 h-28 w-28 rounded-full bg-peach" />
            <div className="blob absolute right-12 top-16 h-20 w-20 rounded-full bg-secondary/70" />
            <div className="blob absolute bottom-0 right-0 h-44 w-44 rounded-full bg-primary/20" />

            <Badge className="bg-white/80">
              Belajar kalimat dengan cara yang lembut dan ceria
            </Badge>
            <h1 className="mt-5 max-w-2xl font-heading text-4xl font-semibold leading-tight text-primary-strong md:text-6xl">
              Website edukasi interaktif untuk membantu siswa tunarungu menyusun kalimat.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-foreground/80">
              Spok Belajar membantu anak menyusun kata menjadi kalimat sederhana
              melalui kartu kata, dukungan GIF bahasa isyarat, dan umpan balik
              yang ramah.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/student">
                <Button className="w-full gap-2 sm:w-auto" size="lg">
                  Mulai Belajar
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button className="w-full sm:w-auto" size="lg" variant="secondary">
                  Login Guru
                </Button>
              </Link>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {["Anak-anak", "Guru", "Admin"].map((item) => (
                <div
                  className="rounded-[24px] border border-white/70 bg-white/70 px-4 py-4 text-center"
                  key={item}
                >
                  <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary-strong">
                    <Star className="h-4 w-4" />
                  </div>
                  <p className="font-bold">{item}</p>
                  <p className="text-sm text-foreground/70">Nyaman dipakai setiap hari</p>
                </div>
              ))}
            </div>
          </div>

          <Card className="relative overflow-hidden p-0" tone="highlight">
            <div className="soft-grid relative h-full min-h-[420px] overflow-hidden rounded-[32px] p-8">
              <div className="animate-float absolute left-8 top-8 rounded-[28px] bg-white px-6 py-5 card-shadow">
                <p className="text-sm font-bold text-primary-strong">Contoh latihan</p>
                <div className="mt-4 flex gap-2">
                  {["Saya", "makan", "nasi"].map((word) => (
                    <span
                      className="rounded-full bg-surface-muted px-4 py-2 text-sm font-bold"
                      key={word}
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </div>

              <div className="animate-float absolute right-6 top-28 rounded-[28px] bg-white px-5 py-5 card-shadow [animation-delay:300ms]">
                <div className="flex h-36 w-40 items-center justify-center rounded-[24px] bg-linear-to-br from-primary/20 to-secondary/25">
                  <div className="text-center">
                    <p className="text-4xl">🤟</p>
                    <p className="mt-2 text-sm font-bold">Preview GIF Isyarat</p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-8 left-8 right-8 rounded-[30px] bg-white/90 p-6 card-shadow">
                <p className="font-heading text-2xl font-semibold">
                  Ceria, sederhana, dan mudah dipahami
                </p>
                <p className="mt-3 text-sm leading-7 text-foreground/75 md:text-base">
                  Dirancang untuk tablet maupun desktop dengan tombol besar,
                  sudut lembut, warna pastel, dan alur belajar yang tidak
                  membingungkan.
                </p>
              </div>
            </div>
          </Card>
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <Card className="rounded-[30px]" key={feature.title}>
                <div
                  className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br ${feature.tone} text-primary-strong`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="font-heading text-2xl font-semibold">{feature.title}</h2>
                <p className="mt-3 text-sm leading-7 text-foreground/75 md:text-base">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </section>
      </main>
    </div>
  );
}
