import { useState, useEffect, useRef, useCallback } from 'react'
import { Play, Pause, Square, SkipForward, Volume2, VolumeX, Settings2, X } from 'lucide-react'
import { audioService } from '../../services/audioService.js'

/**
 * Panneau principal de lecture audio (TTS).
 * Se connecte à audioService qui utilise window.speechSynthesis.
 *
 * Props :
 *   text       — texte à lire (chapitre courant)
 *   bookTitle  — titre du livre affiché
 *   onClose    — fermer le panneau
 *   onNext     — passer au chapitre suivant
 *   hasNext    — s'il y a un chapitre suivant
 */
export function AudioPlayer({ text, bookTitle, onClose, onNext, hasNext }) {
  const [playing, setPlaying] = useState(false)
  const [paused, setPaused] = useState(false)
  const [rate, setRate] = useState(1)
  const [volume, setVolume] = useState(1)
  const [currentWord, setCurrentWord] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [error, setError] = useState(null)
  const [voicesLoaded, setVoicesLoaded] = useState(false)

  // Charger les voix au montage
  useEffect(() => {
    audioService.loadVoices().then(() => setVoicesLoaded(true))
    return () => { audioService.stop() }
  }, [])

  const handlePlay = useCallback(() => {
    setError(null)
    if (paused) {
      audioService.resume()
      setPlaying(true)
      setPaused(false)
      return
    }
    audioService.play({
      text,
      rate,
      volume,
      onWord: ({ charIndex }) => {
        const slice = text.slice(charIndex, charIndex + 30)
        const word = slice.split(/\s/)[0]
        setCurrentWord(word)
      },
      onEnd: () => {
        setPlaying(false)
        setPaused(false)
        setCurrentWord('')
      },
      onError: (msg) => {
        setError(msg)
        setPlaying(false)
        setPaused(false)
      },
    })
    setPlaying(true)
    setPaused(false)
  }, [text, rate, volume, paused])

  const handlePause = useCallback(() => {
    audioService.pause()
    setPlaying(false)
    setPaused(true)
  }, [])

  const handleStop = useCallback(() => {
    audioService.stop()
    setPlaying(false)
    setPaused(false)
    setCurrentWord('')
  }, [])

  const handleNext = useCallback(() => {
    handleStop()
    onNext?.()
  }, [handleStop, onNext])

  // Redémarrer si le taux change pendant la lecture
  const wasPlaying = useRef(false)
  useEffect(() => {
    if (playing) {
      wasPlaying.current = true
      audioService.stop()
      audioService.play({
        text, rate, volume,
        onEnd: () => { setPlaying(false); setPaused(false); setCurrentWord('') },
        onError: (msg) => { setError(msg); setPlaying(false) },
      })
    }
  }, [rate]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 border-t border-[#ded3c1] bg-[#f7f1e6]/97 shadow-2xl backdrop-blur-sm">
      <div className="mx-auto max-w-4xl px-4 py-3">
        {/* Erreur */}
        {error && (
          <div className="mb-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            <span className="flex-1">{error}</span>
            <button onClick={() => setError(null)}><X className="h-3.5 w-3.5" /></button>
          </div>
        )}

        <div className="flex items-center gap-3">
          {/* Infos */}
          <div className="flex-1 min-w-0">
            <p className="truncate text-xs font-semibold text-[#1a1410]">{bookTitle}</p>
            {currentWord ? (
              <p className="truncate text-xs text-[#c17248]">« {currentWord}… »</p>
            ) : (
              <p className="text-xs text-[#8f7770]">
                {playing ? 'Lecture en cours…' : paused ? 'En pause' : 'Prêt à lire'}
              </p>
            )}
          </div>

          {/* Contrôles */}
          <AudioControls
            playing={playing}
            paused={paused}
            hasNext={hasNext}
            onPlay={handlePlay}
            onPause={handlePause}
            onStop={handleStop}
            onNext={handleNext}
          />

          {/* Volume / settings */}
          <div className="flex items-center gap-2">
            <button onClick={() => setShowSettings((v) => !v)}
              className={`rounded-lg p-2 hover:bg-[#efe6d6] ${showSettings ? 'bg-[#efe6d6] text-[#133a28]' : 'text-[#705f57]'}`}
              title="Paramètres audio">
              <Settings2 className="h-4 w-4" />
            </button>
            <button onClick={onClose}
              className="rounded-lg p-2 text-[#705f57] hover:bg-[#efe6d6] hover:text-[#133a28]"
              title="Fermer le lecteur audio">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Paramètres étendus */}
        {showSettings && (
          <AudioSettings rate={rate} volume={volume} onRate={setRate} onVolume={setVolume} />
        )}
      </div>
    </div>
  )
}

/** Boutons de contrôle audio */
export function AudioControls({ playing, paused, hasNext, onPlay, onPause, onStop, onNext }) {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={onStop}
        className="rounded-lg p-2 text-[#705f57] hover:bg-[#efe6d6] hover:text-[#133a28]"
        title="Arrêter"
      >
        <Square className="h-4 w-4" />
      </button>

      <button
        onClick={playing ? onPause : onPlay}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#133a28] text-white hover:bg-[#1d5a3e]"
        title={playing ? 'Pause' : 'Lire'}
      >
        {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 translate-x-px" />}
      </button>

      {hasNext && (
        <button
          onClick={onNext}
          className="rounded-lg p-2 text-[#705f57] hover:bg-[#efe6d6] hover:text-[#133a28]"
          title="Chapitre suivant"
        >
          <SkipForward className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

/** Paramètres de vitesse et volume */
export function AudioSettings({ rate, volume, onRate, onVolume }) {
  const rates = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]

  return (
    <div className="mt-3 flex flex-wrap items-center gap-5 border-t border-[#ede5d8] pt-3">
      {/* Vitesse */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-[#705f57] w-14">Vitesse</span>
        <div className="flex gap-1 overflow-x-auto">
          {rates.map((r) => (
            <button key={r} onClick={() => onRate(r)}
              className={`shrink-0 rounded px-2.5 py-1 text-xs transition-colors ${rate === r ? 'bg-[#133a28] text-white' : 'border border-[#d9d1c6] text-[#705f57] hover:border-[#133a28]'}`}>
              {r}×
            </button>
          ))}
        </div>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-[#705f57] w-14">Volume</span>
        {volume === 0 ? <VolumeX className="h-4 w-4 text-[#705f57]" /> : <Volume2 className="h-4 w-4 text-[#705f57]" />}
        <input
          type="range" min={0} max={1} step={0.1} value={volume}
          onChange={(e) => onVolume(Number(e.target.value))}
          className="h-1 w-28 cursor-pointer accent-[#133a28]"
        />
        <span className="text-xs text-[#8f7770]">{Math.round(volume * 100)}%</span>
      </div>
    </div>
  )
}
