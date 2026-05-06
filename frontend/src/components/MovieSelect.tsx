import { useState, useRef, useEffect } from "react";
import { mockMovies, Movie } from "../data/movies";
import { useLang } from "../context/LanguageContext";

interface Props {
  value: Movie | null;
  onChange: (m: Movie) => void;
}

export default function MovieSelect({ value, onChange }: Props) {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const filtered = mockMovies.filter((m) =>
    m.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg text-left hover:border-brand-500"
      >
        {value ? (
          <span className="flex items-center gap-2">
            <span className="text-2xl">{value.poster}</span>
            <span className="font-medium">{value.title}</span>
            <span className="text-sm text-gray-500">• {value.duration}</span>
          </span>
        ) : (
          <span className="text-gray-400">{t.movie}</span>
        )}
        <span className="text-gray-400">▾</span>
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchMovie}
            className="w-full px-4 py-3 border-b border-gray-200 outline-none"
          />
          <div className="max-h-64 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-4 py-6 text-center text-gray-400 text-sm">No results</div>
            ) : (
              filtered.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    onChange(m);
                    setOpen(false);
                    setQuery("");
                  }}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-brand-50 text-left"
                >
                  <span className="text-2xl">{m.poster}</span>
                  <div className="flex-1">
                    <div className="font-medium">{m.title}</div>
                    <div className="text-xs text-gray-500">
                      {m.genre} • {m.duration}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
