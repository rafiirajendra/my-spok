export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="card-shadow animate-pop-in rounded-[32px] bg-white px-8 py-6 text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary/25 border-t-primary" />
        <p className="font-heading text-2xl font-semibold text-primary-strong">
          Menyiapkan halaman...
        </p>
        <p className="mt-2 text-sm text-foreground/70">
          Sebentar ya, kami sedang menata semuanya.
        </p>
      </div>
    </div>
  );
}
