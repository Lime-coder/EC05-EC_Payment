import { useLang } from "../context/LanguageContext";

interface Props {
  selected: string[];
  onToggle: (seat: string) => void;
}

const ROWS = ["A", "B", "C", "D", "E"];
const COLS = [1, 2, 3, 4, 5, 6];

export default function SeatGrid({ selected, onToggle }: Props) {
  const { t } = useLang();
  return (
    <div>
      <div className="mb-6">
        <div className="h-2 bg-gradient-to-r from-transparent via-brand-500 to-transparent rounded-full mb-2" />
        <div className="text-center text-xs font-bold tracking-[0.3em] text-gray-400">
          {t.screen}
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 mb-6">
        {ROWS.map((row) => (
          <div key={row} className="flex items-center gap-2">
            <span className="w-6 text-center text-xs font-semibold text-gray-400">{row}</span>
            <div className="flex gap-2">
              {COLS.map((col) => {
                const id = `${row}${col}`;
                const isSelected = selected.includes(id);
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => onToggle(id)}
                    className={`w-9 h-9 rounded-t-lg text-xs font-semibold transition ${
                      isSelected
                        ? "bg-brand-500 text-white scale-110"
                        : "bg-gray-100 text-gray-700 hover:bg-brand-100"
                    }`}
                  >
                    {col}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-100" /> {t.available}
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-brand-500" /> {t.selected}
        </div>
      </div>
    </div>
  );
}
