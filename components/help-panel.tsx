import { Info } from "lucide-react"

export function HelpPanel({
  title,
  content,
  example,
  examples,
  note,
}: {
  title: string
  content: string[]
  example?: string
  examples?: string[]
  note?: string
}) {
  return (
    <div className="mb-6 rounded-lg brand-help-panel p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#007BFF]/10 text-[#007BFF]">
          <Info className="h-4 w-4" />
        </div>
        <div>
          <h3 className="font-medium text-[#007BFF]">{title}</h3>

          <div className="mt-2 space-y-2 text-blue-800">
            {content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {example && <div className="mt-3 rounded-md bg-white/60 p-3 text-sm text-blue-800">{example}</div>}

          {examples && (
            <div className="mt-3 rounded-md bg-white/60 p-3 text-sm text-blue-800">
              <p className="font-medium">Examples:</p>
              <ul className="mt-1 list-inside list-disc">
                {examples.map((ex, index) => (
                  <li key={index}>{ex}</li>
                ))}
              </ul>
            </div>
          )}

          {note && (
            <div className="mt-3 flex items-start gap-2 text-sm">
              <span className="font-medium">Note:</span>
              <span>{note}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
