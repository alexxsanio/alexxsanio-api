export default function ProjectsPage() {
  const projects = [
    {
      title: "Compare Software Engineer Job Description & Your Resume",
      description:
        "Returns a score between job responsibility and your experiences, and highlights keywords in technical skill requirements that matches with skills mentioned in your resume. ",
      link: "/compare-job-description",
    },
    {
      title: "Compile & Create Treemap",
      description:
        "Try this out to create a treemap (ratio plot alternative) for your data!",
      link: "/create-treemap",
    },
  ];

  return (
    <main className="min-h-screen bg-white text-black flex justify-center">
      <div className="w-full max-w-2xl px-6 py-16 border-l border-r border-black">
        
        <h1 className="text-center text-3xl font-semibold mb-16 tracking-wide">
          Tiny Toolings ©DotsAI
        </h1>

        <div className="space-y-12">
          {projects.map((p, i) => (
            <a key={i} href={p.link} className="block group">
              <h2 className="text-xl font-medium underline group-hover:no-underline">
                {p.title}
              </h2>
              <p className="mt-2 text-sm text-gray-700">
                {p.description}
              </p>
            </a>
          ))}
        </div>

      </div>
    </main>
  );
}