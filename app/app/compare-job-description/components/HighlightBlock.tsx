type Props = {
  title: string;
  html: string;
};

export default function HighlightBlock({ title, html }: Props) {
  return (
    <div>
      <h3 className="font-semibold mb-2 text-gray-600">{title}</h3>
      <div
        className="p-4 border rounded-lg bg-gray-50 prose max-w-none text-gray-600"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}