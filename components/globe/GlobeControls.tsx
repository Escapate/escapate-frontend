"use client";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Pause,
  Play,
  Plus,
  Minus,
  RotateCcw,
} from "lucide-react";
import { useCallback, useEffect, useState, type RefObject } from "react";
import { useI18n } from "@/lib/i18n";
import type { GlobeInput } from "./Globe";

type Dir = "left" | "right" | "up" | "down";

const btnCls =
  "grid h-8 w-8 cursor-pointer place-items-center rounded-lg border border-white/15 bg-white/5 text-cream-50 outline-none transition hover:bg-white/15 hover:text-orange-400 focus-visible:ring-2 focus-visible:ring-orange active:scale-95";

/**
 * Controles accesibles para mover el globo: pad direccional (mantener para girar),
 * play/pausa de la rotación y recentrar. Escribe la intención en un ref compartido que
 * el canvas lee cada frame (react-three-fiber no propaga contexto hacia dentro del Canvas).
 * Funciona con mouse/touch (mantener presionado), con Enter/Espacio en cada botón y con
 * las flechas del teclado cuando el panel tiene foco.
 */
export default function GlobeControls({
  input,
  onZoomIn,
  onZoomOut,
  onReset,
  canZoomIn = true,
  canZoomOut = true,
  showPad = true,
}: {
  input: RefObject<GlobeInput>;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onReset?: () => void;
  canZoomIn?: boolean;
  canZoomOut?: boolean;
  showPad?: boolean;
}) {
  const { c } = useI18n();
  const g = c.globe;
  // Se inicializa desde el flag compartido para no desincronizarse al re-montar el panel
  // (los controles del hero son colapsables → se montan/desmontan).
  const [playing, setPlaying] = useState(() => input.current?.autoRotate ?? true);
  const hasZoom = !!(onZoomIn && onZoomOut);

  const start = useCallback(
    (dir: Dir) => {
      const inp = input.current;
      if (!inp) return;
      if (dir === "left") inp.azVel = -1;
      else if (dir === "right") inp.azVel = 1;
      else if (dir === "up") inp.polVel = -1;
      else if (dir === "down") inp.polVel = 1;
    },
    [input]
  );

  // Detiene solo el eje soltado (o ambos si no se pasa `dir`) → permite girar en diagonal
  // (dos direcciones a la vez) sin que soltar una mate la otra.
  const stop = useCallback(
    (dir?: Dir) => {
      const inp = input.current;
      if (!inp) return;
      if (!dir || dir === "left" || dir === "right") inp.azVel = 0;
      if (!dir || dir === "up" || dir === "down") inp.polVel = 0;
    },
    [input]
  );

  // Seguridad: si el componente se desmonta mientras se mantenía una tecla/botón, no dejar
  // el globo girando.
  useEffect(() => () => stop(), [stop]);

  const togglePlay = useCallback(() => {
    setPlaying((p) => {
      const next = !p;
      if (input.current) input.current.autoRotate = next;
      return next;
    });
  }, [input]);

  const reset = useCallback(() => {
    if (input.current) input.current.resetToken += 1;
    onReset?.();
  }, [input, onReset]);

  const keyToDir: Record<string, Dir> = {
    ArrowLeft: "left",
    ArrowRight: "right",
    ArrowUp: "up",
    ArrowDown: "down",
  };

  const dirButton = (dir: Dir, label: string, icon: React.ReactNode) => (
    <button
      type="button"
      aria-label={label}
      className={btnCls}
      onPointerDown={(e) => {
        e.preventDefault();
        start(dir);
      }}
      onPointerUp={() => stop(dir)}
      onPointerLeave={() => stop(dir)}
      onPointerCancel={() => stop(dir)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          start(dir);
        }
      }}
      onKeyUp={(e) => {
        if (e.key === "Enter" || e.key === " ") stop(dir);
      }}
    >
      {icon}
    </button>
  );

  const zoomCls = `${btnCls} disabled:cursor-default disabled:opacity-30 disabled:hover:bg-white/5 disabled:hover:text-cream-50`;
  const pauseBtn = (
    <button
      type="button"
      aria-label={playing ? g.pause : g.resume}
      onClick={togglePlay}
      className={btnCls}
    >
      {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
    </button>
  );
  const resetBtn = (
    <button type="button" aria-label={g.recenter} onClick={reset} className={btnCls}>
      <RotateCcw className="h-4 w-4" />
    </button>
  );
  const zoomOutBtn = hasZoom ? (
    <button type="button" aria-label={g.zoomOut} onClick={onZoomOut} disabled={!canZoomOut} className={zoomCls}>
      <Minus className="h-4 w-4" />
    </button>
  ) : null;
  const zoomInBtn = hasZoom ? (
    <button type="button" aria-label={g.zoomIn} onClick={onZoomIn} disabled={!canZoomIn} className={zoomCls}>
      <Plus className="h-4 w-4" />
    </button>
  ) : null;

  const onZoomKeys = (e: React.KeyboardEvent) => {
    if (e.key === "+" || e.key === "=") {
      e.preventDefault();
      if (canZoomIn) onZoomIn?.();
    } else if (e.key === "-" || e.key === "_") {
      e.preventDefault();
      if (canZoomOut) onZoomOut?.();
    }
  };

  // Modo compacto (p. ej. Explorar): solo zoom, recentrar y pausa (sin pad direccional).
  if (!showPad) {
    return (
      <div
        role="group"
        aria-label={g.controls}
        onKeyDown={onZoomKeys}
        className="pointer-events-auto flex items-center gap-1 rounded-xl border border-white/15 bg-navy-950/60 p-1.5 backdrop-blur"
      >
        {zoomOutBtn}
        {zoomInBtn}
        {resetBtn}
        {pauseBtn}
      </div>
    );
  }

  return (
    <div
      role="group"
      aria-label="Controles del globo"
      onKeyDown={(e) => {
        const dir = keyToDir[e.key];
        if (dir) {
          e.preventDefault();
          start(dir);
          return;
        }
        onZoomKeys(e);
      }}
      onKeyUp={(e) => {
        const dir = keyToDir[e.key];
        if (dir) stop(dir);
      }}
      className="pointer-events-auto grid grid-cols-3 gap-1 rounded-xl border border-white/15 bg-navy-950/60 p-1.5 backdrop-blur"
    >
      <span aria-hidden="true" />
      {dirButton("up", g.rotateUp, <ChevronUp className="h-4 w-4" />)}
      {pauseBtn}

      {dirButton("left", g.rotateLeft, <ChevronLeft className="h-4 w-4" />)}
      {resetBtn}
      {dirButton("right", g.rotateRight, <ChevronRight className="h-4 w-4" />)}

      {zoomOutBtn ?? <span aria-hidden="true" />}
      {dirButton("down", g.rotateDown, <ChevronDown className="h-4 w-4" />)}
      {zoomInBtn ?? <span aria-hidden="true" />}
    </div>
  );
}
