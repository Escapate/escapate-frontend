"use client";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Pause,
  Play,
  RotateCcw,
} from "lucide-react";
import { useCallback, useEffect, useState, type RefObject } from "react";
import type { GlobeInput } from "./Globe";

type Dir = "left" | "right" | "up" | "down";

const btnCls =
  "grid h-8 w-8 place-items-center rounded-lg border border-white/15 bg-white/5 text-cream-50 outline-none transition hover:bg-white/15 hover:text-orange-400 focus-visible:ring-2 focus-visible:ring-orange active:scale-95";

/**
 * Controles accesibles para mover el globo: pad direccional (mantener para girar),
 * play/pausa de la rotación y recentrar. Escribe la intención en un ref compartido que
 * el canvas lee cada frame (react-three-fiber no propaga contexto hacia dentro del Canvas).
 * Funciona con mouse/touch (mantener presionado), con Enter/Espacio en cada botón y con
 * las flechas del teclado cuando el panel tiene foco.
 */
export default function GlobeControls({ input }: { input: RefObject<GlobeInput> }) {
  const [playing, setPlaying] = useState(true);

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
  }, [input]);

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

  return (
    <div
      role="group"
      aria-label="Controles del globo"
      onKeyDown={(e) => {
        const dir = keyToDir[e.key];
        if (dir) {
          e.preventDefault();
          start(dir);
        }
      }}
      onKeyUp={(e) => {
        const dir = keyToDir[e.key];
        if (dir) stop(dir);
      }}
      className="pointer-events-auto grid grid-cols-3 gap-1 rounded-xl border border-white/15 bg-navy-950/60 p-1.5 backdrop-blur"
    >
      <span aria-hidden="true" />
      {dirButton("up", "Girar el globo hacia arriba", <ChevronUp className="h-4 w-4" />)}
      <button
        type="button"
        aria-label={playing ? "Pausar la rotación" : "Reanudar la rotación"}
        onClick={togglePlay}
        className={btnCls}
      >
        {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </button>

      {dirButton("left", "Girar el globo a la izquierda", <ChevronLeft className="h-4 w-4" />)}
      <button type="button" aria-label="Recentrar el globo" onClick={reset} className={btnCls}>
        <RotateCcw className="h-4 w-4" />
      </button>
      {dirButton("right", "Girar el globo a la derecha", <ChevronRight className="h-4 w-4" />)}

      <span aria-hidden="true" />
      {dirButton("down", "Girar el globo hacia abajo", <ChevronDown className="h-4 w-4" />)}
      <span aria-hidden="true" />
    </div>
  );
}
