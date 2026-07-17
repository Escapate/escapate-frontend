"use client";

import { Billboard, Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { X } from "lucide-react";
import { useRef, useState, type RefObject } from "react";
import * as THREE from "three";

export type DestinoMarkerData = {
  id: string;
  name: string;
  price: string;
  img: string;
};

// Naranja de marca. Proporciones/emisivo/color son ajuste visual fino (calibrar en pnpm dev).
const PIN_COLOR = "#E8732A";
const HEAD_R = 0.06; // radio de la cabeza
const HEAD_H = 0.12; // altura del centro de la cabeza sobre la punta
const LIFT = 0.04; // cuánto salta el pin al hover/activo

// Pin de ubicación estilo icono 3D: gota (cabeza redonda + punta abajo) con hueco real,
// extruida y biselada para que se vea con volumen glossy. Se construye una sola vez (compartida).
function buildPinGeometry(): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0); // punta (queda anclada en la superficie)
  shape.quadraticCurveTo(HEAD_R * 0.55, HEAD_H * 0.35, HEAD_R, HEAD_H); // costado derecho
  shape.absarc(0, HEAD_H, HEAD_R, 0, Math.PI, false); // arco superior de la cabeza
  shape.quadraticCurveTo(-HEAD_R * 0.55, HEAD_H * 0.35, 0, 0); // costado izquierdo → punta

  const hole = new THREE.Path();
  hole.absarc(0, HEAD_H, HEAD_R * 0.42, 0, Math.PI * 2, true); // hueco tipo dona
  shape.holes.push(hole);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.028,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.014,
    bevelSegments: 4,
    curveSegments: 32,
  });
  geo.translate(0, 0, -0.028); // centra el grosor alrededor de z=0 (mira a la cámara vía Billboard)
  geo.computeVertexNormals();
  return geo;
}

const PIN_GEOMETRY = buildPinGeometry();

export default function DestinoMarker({
  data,
  position,
  active,
  onActivate,
  onClose,
  onCotizar,
  cotizarLabel,
  occludeRef,
}: {
  data: DestinoMarkerData;
  position: [number, number, number];
  active: boolean;
  onActivate: () => void;
  onClose: () => void;
  onCotizar: () => void;
  cotizarLabel: string;
  occludeRef: RefObject<THREE.Object3D>;
}) {
  const [hovered, setHovered] = useState(false);
  const liftRef = useRef<THREE.Group>(null!);

  // Elevación + escala animadas (damp = independiente del frame-rate).
  useFrame((_, dt) => {
    const g = liftRef.current;
    if (!g) return;
    const up = hovered || active;
    g.position.y = THREE.MathUtils.damp(g.position.y, up ? LIFT : 0, 9, dt);
    const target = active ? 1.22 : hovered ? 1.12 : 1;
    const s = THREE.MathUtils.damp(g.scale.x, target, 9, dt);
    g.scale.setScalar(s);
  });

  return (
    <group position={position}>
      {/* Billboard: el pin siempre mira a la cámara (look de icono de ubicación). */}
      <Billboard>
        {/* Área de hit invisible (estática) para hover/click. */}
        <mesh
          position={[0, HEAD_H, 0]}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            setHovered(false);
            document.body.style.cursor = "auto";
          }}
          onClick={(e) => {
            e.stopPropagation();
            onActivate();
          }}
        >
          <circleGeometry args={[0.12, 24]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>

        {/* Pin visible (salta/escala en liftRef). */}
        <group ref={liftRef}>
          <mesh geometry={PIN_GEOMETRY}>
            <meshStandardMaterial
              color={PIN_COLOR}
              emissive={PIN_COLOR}
              emissiveIntensity={active || hovered ? 0.4 : 0.2}
              roughness={0.25}
              metalness={0.1}
            />
          </mesh>
        </group>

        {active && (
          <Html
            position={[0, HEAD_H + 0.14, 0]}
            center
            distanceFactor={6}
            occlude={[occludeRef]}
            zIndexRange={[40, 0]}
          >
            <div
              onMouseLeave={onClose}
              className="w-44 overflow-hidden rounded-xl border border-white/15 bg-navy-950/95 text-cream-50 shadow-2xl backdrop-blur"
            >
              <div className="relative h-24 w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={data.img} alt={data.name} className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Cerrar"
                  className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-navy-950/70 text-cream-50 transition hover:bg-navy-950"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="p-3">
                <p className="font-heading text-sm font-bold">{data.name}</p>
                <p className="mt-0.5 font-mono text-[11px] text-orange-400">{data.price}</p>
                <button
                  type="button"
                  onClick={onCotizar}
                  className="mt-2 w-full rounded-lg bg-orange px-3 py-1.5 text-xs font-bold text-white transition hover:bg-orange-600"
                >
                  {cotizarLabel}
                </button>
              </div>
            </div>
          </Html>
        )}
      </Billboard>
    </group>
  );
}
