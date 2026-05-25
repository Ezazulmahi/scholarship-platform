export default function Home() {
  const featuredScholarships = [
    {
      name: "Global STEM Grant",
      deadline: "June 14",
      amount: "$12,000",
      tag: "Engineering",
    },
    {
      name: "Future Leaders Fund",
      deadline: "June 28",
      amount: "$8,500",
      tag: "Leadership",
    },
    {
      name: "Community Impact Award",
      deadline: "July 05",
      amount: "$5,000",
      tag: "Social Work",
    },
  ];

  const checklist = [
    "Profile completed and ready for review",
    "Transcript uploaded to document vault",
    "Essay draft saved for scholarship matching",
  ];

  return (
    <main className="relative isolate overflow-hidden">
      <div className="hero-backdrop absolute inset-x-0 top-0 -z-10 h-128" />
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between rounded-full border border-white/20 bg-white/10 px-5 py-3 text-white backdrop-blur">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-white/70">
              Scholarship Platform
            </p>
            <h1 className="text-lg font-semibold">Student Funding Hub</h1>
          </div>
          <a
            href="#featured"
            className="rounded-full border border-white/35 px-4 py-2 text-sm font-medium transition hover:bg-white/10"
          >
            Explore Awards
          </a>
        </header>

        <section className="grid flex-1 items-center gap-6 py-10 lg:grid-cols-[1.25fr_0.85fr] lg:py-14">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 rounded-full border border-emerald-200/50 bg-white/75 px-4 py-2 text-sm text-emerald-950 shadow-sm backdrop-blur">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              Demo view ready for backend integration
            </div>

            <div className="max-w-3xl space-y-5">
              <p className="text-sm font-semibold uppercase tracking-[0.4em] text-white/80">
                Smart matching for ambitious students
              </p>
              <h2 className="text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                Find scholarships, track deadlines, and manage applications in
                one calm workspace.
              </h2>
              <p className="max-w-2xl text-lg leading-8 text-emerald-50/90">
                This placeholder homepage gives you a clean visual shell while
                we wire up the real data, forms, and account flows.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <a
                href="#featured"
                className="rounded-full bg-[#f8f1de] px-6 py-3 text-center text-sm font-semibold text-emerald-950 transition hover:-translate-y-0.5 hover:bg-white"
              >
                View Featured Scholarships
              </a>
              <a
                href="#overview"
                className="rounded-full border border-white/30 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10"
              >
                See Dashboard Preview
              </a>
            </div>

            <div
              id="overview"
              className="grid gap-4 sm:grid-cols-3"
            >
              {[
                { label: "Open awards", value: "128" },
                { label: "Upcoming deadlines", value: "09" },
                { label: "Average match score", value: "91%" },
              ].map((item) => (
                <article
                  key={item.label}
                  className="rounded-3xl border border-white/15 bg-white/10 p-5 text-white shadow-lg shadow-emerald-950/10 backdrop-blur"
                >
                  <p className="text-sm text-white/75">{item.label}</p>
                  <p className="mt-3 text-3xl font-semibold">{item.value}</p>
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-4xl border border-white/15 bg-[#fffaf0] p-5 shadow-2xl shadow-emerald-950/20">
            <div className="rounded-3xl bg-[#11382e] p-5 text-white">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-emerald-100/80">Applicant score</p>
                  <p className="mt-2 text-4xl font-semibold">86%</p>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-emerald-100">
                  Strong fit
                </span>
              </div>
              <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[86%] rounded-full bg-[#f4b860]" />
              </div>
              <div className="mt-6 grid gap-3 text-sm text-emerald-50/85">
                {checklist.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <article className="rounded-3xl bg-[#f6ead1] p-5 text-emerald-950">
                <p className="text-sm font-medium text-emerald-900/70">
                  Next deadline
                </p>
                <h3 className="mt-2 text-2xl font-semibold">
                  Global STEM Grant
                </h3>
                <p className="mt-1 text-sm">Submit before June 14 at 11:59 PM</p>
              </article>
              <article className="rounded-3xl border border-[#eadfcb] bg-white p-5 text-emerald-950">
                <p className="text-sm font-medium text-emerald-900/70">
                  Suggested action
                </p>
                <p className="mt-2 text-lg font-semibold">
                  Finish the personal statement draft
                </p>
              </article>
            </div>
          </aside>
        </section>

        <section
          id="featured"
          className="grid gap-6 rounded-4xl bg-white/85 p-6 shadow-xl shadow-emerald-950/10 backdrop-blur lg:grid-cols-[0.9fr_1.1fr]"
        >
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">
              Featured Scholarships
            </p>
            <h3 className="text-3xl font-semibold tracking-tight text-emerald-950">
              A simple mock dashboard to prove out the experience.
            </h3>
            <p className="text-base leading-7 text-slate-600">
              These cards are static for now, but the layout is ready for real
              scholarship records from the backend later.
            </p>
          </div>

          <div className="grid gap-4">
            {featuredScholarships.map((scholarship) => (
              <article
                key={scholarship.name}
                className="grid gap-4 rounded-3xl border border-emerald-100 bg-[#fcfaf5] p-5 sm:grid-cols-[1fr_auto]"
              >
                <div>
                  <div className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-800">
                    {scholarship.tag}
                  </div>
                  <h4 className="mt-3 text-xl font-semibold text-emerald-950">
                    {scholarship.name}
                  </h4>
                  <p className="mt-2 text-sm text-slate-600">
                    Priority candidate match with essay and profile review
                    completed.
                  </p>
                </div>
                <div className="flex items-end justify-between gap-6 sm:flex-col sm:items-end">
                  <div className="text-right">
                    <p className="text-sm text-slate-500">Award</p>
                    <p className="text-2xl font-semibold text-emerald-950">
                      {scholarship.amount}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500">Deadline</p>
                    <p className="font-semibold text-emerald-900">
                      {scholarship.deadline}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
