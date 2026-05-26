import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#071428] flex flex-col items-center justify-center px-6">
      {/* Logo */}
      <div className="mb-8 text-center">
        <h1 className="text-5xl font-bold tracking-widest uppercase text-[#c8a84b] font-sans mb-2">
          Loop Golf
        </h1>
        <p className="text-[#8090a4] text-sm tracking-widest uppercase">
          Your trip. Your tournament. Your history.
        </p>
      </div>

      {/* CTA */}
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Link
          href="/auth/signup"
          className="w-full text-center bg-[#c8a84b] hover:bg-[#e8cc7a] text-[#071428] font-bold py-3 px-6 rounded-lg text-sm tracking-widest uppercase transition-colors"
        >
          Create an Event
        </Link>
        <Link
          href="/auth/signin"
          className="w-full text-center border border-[#c8a84b]/40 hover:border-[#c8a84b] text-[#c8a84b] font-bold py-3 px-6 rounded-lg text-sm tracking-widest uppercase transition-colors"
        >
          Sign In
        </Link>
      </div>

      {/* Footer */}
      <p className="mt-16 text-[#4a5a7a] text-xs tracking-wide">
        Loop Golf · Built for groups who take it seriously
      </p>
    </main>
  )
}