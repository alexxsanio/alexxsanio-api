export default function ProjectsPage() {
  const projects = [
    {
      title: "Minimal Chat App",
      description: "A simple real-time chat built with websockets.",
      link: "/compare-job-description",
    },
    {
      title: "Markdown Editor",
      description: "Live preview markdown editor with export support.",
      link: "#",
    },
    {
      title: "AI Toy Generator",
      description: "Generate small creative tools powered by AI.",
      link: "#",
    },
  ];

  return (
    <main className="min-h-screen bg-white text-black flex justify-center">
      {/* Booklet container */}
      <div className="w-full max-w-2xl px-6 py-16 border-l border-r border-black">
        
        {/* Title */}
        <h1 className="text-center text-3xl font-semibold mb-16 tracking-wide">
          Toy Projects ©DotAI
        </h1>

        {/* Projects list */}
        <div className="space-y-12">
          {projects.map((project, i) => (
            <a
              key={i}
              href={project.link}
              className="block group"
            >
              <h2 className="text-xl font-medium underline group-hover:no-underline">
                {project.title}
              </h2>
              <p className="mt-2 text-sm text-gray-700">
                {project.description}
              </p>
            </a>
          ))}
        </div>

      </div>
    </main>
  );
}