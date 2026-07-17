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

// ── Ajuste visual fino (probar en pnpm dev) ──────────────────────────────────
// Color del pin. Alternativas que pegan sobre el globo navy:
//   naranja de marca "#E8732A" · rojo pin clásico "#FF4D4D" · coral "#FF6B4A"
//   ámbar "#F5B301" · turquesa "#22C1B6" · fucsia "#FF3D8B"
const PIN_COLOR = "#FF6B4A";
const OUTLINE_COLOR = "#0A1524"; // contorno/relleno del hueco (navy oscuro) → separa pines solapados
const HEAD_R = 0.06; // radio de la cabeza
const HEAD_H = 0.12; // altura del centro de la cabeza sobre la punta
const HOLE_RATIO = 0.7; // tamaño del hueco respecto al radio de la cabeza
const LIFT = 0.06; // cuánto salta el pin al hover/activo (sube por encima del montón)
// ─────────────────────────────────────────────────────────────────────────────

// Pin de ubicación estilo icono 3D: gota (cabeza redonda + punta abajo) con hueco real,
// extruida y biselada para que se vea con volumen glossy. Geometría compartida (una sola vez).
function buildPinGeometry(): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0); // punta (queda anclada en la superficie)
  shape.quadraticCurveTo(HEAD_R * 0.55, HEAD_H * 0.35, HEAD_R, HEAD_H); // costado derecho
  shape.absarc(0, HEAD_H, HEAD_R, 0, Math.PI, false); // arco superior de la cabeza
  shape.quadraticCurveTo(-HEAD_R * 0.55, HEAD_H * 0.35, 0, 0); // costado izquierdo → punta

  const hole = new THREE.Path();
  hole.absarc(0, HEAD_H, HEAD_R * HOLE_RATIO, 0, Math.PI * 2, true); // hueco tipo dona
  shape.holes.push(hole);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.028,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.014,
    bevelSegments: 4,
    curveSegments: 32,
  });
  geo.translate(0, 0, -0.028); // centra el grosor (mira a la cámara vía Billboard)
  geo.computeVertexNormals();
  return geo;
}

const PIN_GEOMETRY = buildPinGeometry();

// Temporales reutilizados por frame (los useFrame corren en serie → seguro compartirlos).
const _pos = new THREE.Vector3();
const _normal = new THREE.Vector3();
const _toCam = new THREE.Vector3();

export default function DestinoMarker({
  data,
  position,
  active,
  onActivate,
  onClose,
  onCotizar,
  cotizarLabel,
  occludeRef,
  zoom,
}: {
  data: DestinoMarkerData;
  position: [number, number, number];
  active: boolean;
  onActivate: () => void;
  onClose: () => void;
  onCotizar: () => void;
  cotizarLabel: string;
  occludeRef: RefObject<THREE.Object3D>;
  zoom: number;
}) {
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(true);
  const hoveredRef = useRef(false);
  const visibleRef = useRef(true);
  const rootRef = useRef<THREE.Group>(null!);
  const sizeRef = useRef<THREE.Group>(null!);
  const liftRef = useRef<THREE.Group>(null!);

  useFrame((state, dt) => {
    // Culling por orientación: el pin solo se muestra (y es clickeable) si mira a la cámara;
    // los de la cara trasera se quitan (nada de pines invisibles que roben el click). El pin
    // activo siempre se muestra para no ocultar su tarjeta abierta.
    const root = rootRef.current;
    if (root) {
      root.getWorldPosition(_pos);
      _normal.copy(_pos).normalize();
      _toCam.copy(state.camera.position).sub(_pos).normalize();
      const show = active || _normal.dot(_toCam) > 0.12;
      if (show !== visibleRef.current) {
        visibleRef.current = show;
        setVisible(show);
        // Al ocultarse un pin que estaba hovereado, limpiar hover/cursor (su onPointerOut
        // puede no dispararse porque el mesh se desmonta).
        if (!show && hoveredRef.current) {
          hoveredRef.current = false;
          setHovered(false);
          document.body.style.cursor = "auto";
        }
      }
    }

    // Contra-escala por zoom: el pin mantiene su tamaño en pantalla mientras el globo crece
    // (como Google Maps) → al acercar se nota la separación entre pines cercanos.
    const sz = sizeRef.current;
    if (sz) sz.scale.setScalar(THREE.MathUtils.damp(sz.scale.x, 1 / zoom, 6, dt));

    // Elevación + escala animadas (damp = independiente del frame-rate).
    const g = liftRef.current;
    if (!g) return;
    const up = hovered || active;
    g.position.y = THREE.MathUtils.damp(g.position.y, up ? LIFT : 0, 9, dt);
    const target = active ? 1.28 : hovered ? 1.18 : 1;
    const s = THREE.MathUtils.damp(g.scale.x, target, 9, dt);
    g.scale.setScalar(s);
  });

  return (
    <group ref={rootRef} position={position}>
      {/* Solo se monta (visible + clickeable) cuando mira a la cámara. */}
      {visible && (
        <Billboard>
        {/* Tamaño constante en pantalla (Google Maps): contra-escala 1/zoom sobre hit + pin. */}
        <group ref={sizeRef}>
        {/* Área de hit invisible (estática) para hover/click. */}
        <mesh
          position={[0, HEAD_H, 0]}
          onPointerOver={(e) => {
            e.stopPropagation();
            hoveredRef.current = true;
            setHovered(true);
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            hoveredRef.current = false;
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
          {/* Contorno oscuro: copia un poco más ancha, detrás → borde que separa pines
              solapados + rellena el hueco de oscuro (look clásico). */}
          <mesh geometry={PIN_GEOMETRY} position={[0, 0, -0.02]} scale={[1.16, 1.16, 1]}>
            <meshBasicMaterial color={OUTLINE_COLOR} />
          </mesh>

          {/* Cuerpo glossy con emisivo. */}
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
                  className="mt-2 w-full cursor-pointer rounded-lg bg-orange px-3 py-1.5 text-xs font-bold text-white transition hover:bg-orange-600"
                >
                  {cotizarLabel}
                </button>
              </div>
            </div>
          </Html>
        )}
        </Billboard>
      )}
    </group>
  );
}
