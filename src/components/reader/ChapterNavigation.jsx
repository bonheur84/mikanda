export function ChapterNavigation({ onPrev, onNext, disablePrev, disableNext }) {
  return (
    <div className="mt-10 flex items-center justify-between gap-4">
      <button
        type="button"
        id="prev-chapter"
        onClick={onPrev}
        disabled={disablePrev}
        className="rounded-lg border border-[#ded3c1] px-4 py-2 text-sm disabled:opacity-40"
      >
        Chapitre précédent
      </button>
      <button
        type="button"
        id="next-chapter"
        onClick={onNext}
        disabled={disableNext}
        className="rounded-lg bg-[#133a28] px-4 py-2 text-sm text-white disabled:opacity-40"
      >
        Chapitre suivant
      </button>
    </div>
  )
}
