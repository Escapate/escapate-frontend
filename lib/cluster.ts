import { latLngToVec3 } from "./destino-geo";

/** Marcador de entrada al clustering (lo que aporta cada destino con info). */
export type ClusterInput = {
  id: string;
  name: string;
  price: string;
  img: string;
  nights: string;
  lat: number;
  lng: number;
};

/** Grupo de 1+ destinos cercanos, con su centroide ya proyectado a la esfera de render. */
export type Cluster = {
  id: string; // ids de los miembros unidos con "+"
  position: [number, number, number];
  members: ClusterInput[];
};

function dot(a: number[], b: number[]): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function normalize(v: number[]): [number, number, number] {
  const l = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / l, v[1] / l, v[2] / l];
}

/**
 * Agrupa marcadores por cercanía angular sobre la esfera (estable con la rotación, a
 * diferencia de agrupar por distancia en pantalla). Greedy de una pasada: cada marcador
 * entra al primer grupo cuyo centroide esté dentro de `thresholdDeg`, o abre uno nuevo.
 * El centroide final se proyecta a `radius` para renderizar.
 */
export function clusterMarkers(
  markers: readonly ClusterInput[],
  thresholdDeg: number,
  radius: number
): Cluster[] {
  const cosT = Math.cos((thresholdDeg * Math.PI) / 180);
  const groups: Array<{ sum: [number, number, number]; members: ClusterInput[] }> = [];

  for (const m of markers) {
    const v = latLngToVec3(m.lat, m.lng, 1); // vector unitario
    let placed = false;
    for (const g of groups) {
      if (dot(normalize(g.sum), v) >= cosT) {
        g.sum = [g.sum[0] + v[0], g.sum[1] + v[1], g.sum[2] + v[2]];
        g.members.push(m);
        placed = true;
        break;
      }
    }
    if (!placed) groups.push({ sum: [...v], members: [m] });
  }

  return groups.map((g) => {
    const c = normalize(g.sum);
    return {
      id: g.members.map((x) => x.id).join("+"),
      position: [c[0] * radius, c[1] * radius, c[2] * radius] as [number, number, number],
      members: g.members,
    };
  });
}
