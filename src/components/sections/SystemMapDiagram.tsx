"use client";

import { motion, useReducedMotion } from "motion/react";
import type { LocalizedString, SystemMapLayout } from "@/lib/content";
import type { AppLocale } from "@/i18n/routing";

export type SystemNodeRole =
  | "inputTop"
  | "inputBottom"
  | "core"
  | "outputTop"
  | "outputBottom";

export type SystemMapNodes = Record<SystemNodeRole, LocalizedString>;

export type { SystemMapLayout };

const NODE_W = 130;
const NODE_H = 44;
const CORE_W = 150;
const CORE_H = 60;
const NODE_R = 10;
/** Slightly narrower satellites for dense linear layouts. */
const NODE_W_DENSE = 112;

type Point = { x: number; y: number };

type LayoutGeometry = {
  centers: Record<SystemNodeRole, Point>;
  edges: readonly string[];
  /** Decorative shapes under edges (e.g. ERP shared-data bar). */
  extras?: readonly string[];
  nodeWidth?: number;
};

/**
 * Per-system topologies — same five node roles, different geometry.
 * SVG coords are LTR-internal; page RTL is outside the viewBox.
 */
const LAYOUTS: Record<SystemMapLayout, LayoutGeometry> = {
  hub: {
    centers: {
      inputTop: { x: 480, y: 65 },
      inputBottom: { x: 480, y: 195 },
      core: { x: 280, y: 130 },
      outputTop: { x: 80, y: 65 },
      outputBottom: { x: 80, y: 195 },
    },
    edges: [
      "M415 65 C380 65 380 130 345 130",
      "M415 195 C380 195 380 130 345 130",
      "M205 130 C175 130 175 65 145 65",
      "M205 130 C175 130 175 195 145 195",
    ],
  },
  /** CRM — wide inputs converge through core to tighter outputs. */
  funnel: {
    centers: {
      inputTop: { x: 490, y: 42 },
      inputBottom: { x: 490, y: 218 },
      core: { x: 280, y: 130 },
      outputTop: { x: 72, y: 92 },
      outputBottom: { x: 72, y: 168 },
    },
    edges: [
      "M425 42 C390 42 360 100 355 130",
      "M425 218 C390 218 360 160 355 130",
      "M205 130 C170 130 150 100 137 92",
      "M205 130 C170 130 150 160 137 168",
    ],
  },
  /** ERP — column modules above a shared data rail. */
  modules: {
    centers: {
      inputTop: { x: 470, y: 48 },
      inputBottom: { x: 470, y: 118 },
      core: { x: 280, y: 83 },
      outputTop: { x: 90, y: 48 },
      outputBottom: { x: 90, y: 118 },
    },
    edges: [
      "M405 48 C370 48 360 83 355 83",
      "M405 118 C370 118 360 83 355 83",
      "M205 83 C170 83 160 48 155 48",
      "M205 83 C170 83 160 118 155 118",
      "M470 140 L470 185",
      "M280 113 L280 185",
      "M90 140 L90 185",
    ],
    extras: [
      "M55 185 H505",
    ],
  },
  /** RAG — docs → core → answer; query feeds in; quality under answer. */
  pipeline: {
    centers: {
      inputTop: { x: 480, y: 78 },
      inputBottom: { x: 380, y: 200 },
      core: { x: 280, y: 78 },
      outputTop: { x: 80, y: 78 },
      outputBottom: { x: 80, y: 200 },
    },
    edges: [
      "M415 78 H355",
      "M380 178 C380 140 320 120 340 108",
      "M205 78 H145",
      "M80 100 L80 178",
    ],
    nodeWidth: NODE_W_DENSE,
  },
  /** Data — linear ETL stages with a secondary source feed. */
  etl: {
    centers: {
      inputTop: { x: 500, y: 88 },
      inputBottom: { x: 500, y: 200 },
      core: { x: 350, y: 88 },
      outputTop: { x: 200, y: 88 },
      outputBottom: { x: 60, y: 88 },
    },
    edges: [
      "M500 122 L500 178",
      "M444 88 H410",
      "M290 88 H256",
      "M144 88 H116",
      "M440 200 C400 200 380 140 370 110",
    ],
    nodeWidth: NODE_W_DENSE,
  },
  /** Website — vertical stack with side outputs. */
  stack: {
    centers: {
      inputTop: { x: 280, y: 38 },
      inputBottom: { x: 280, y: 222 },
      core: { x: 280, y: 130 },
      outputTop: { x: 78, y: 130 },
      outputBottom: { x: 482, y: 130 },
    },
    edges: [
      "M280 60 L280 100",
      "M280 160 L280 200",
      "M205 130 H143",
      "M355 130 H417",
    ],
  },
};

const NODE_ORDER: SystemNodeRole[] = [
  "inputTop",
  "inputBottom",
  "core",
  "outputTop",
  "outputBottom",
];

export type SystemMapDiagramProps = {
  locale: AppLocale;
  nodes: SystemMapNodes;
  mapLabel: string;
  /** Remount key for enter stagger (e.g. service slug). */
  animationKey: string;
  /** Topology preset — defaults to classic hub. */
  layout?: SystemMapLayout;
};

function pickLocalized(value: LocalizedString, locale: AppLocale): string {
  return value[locale] ?? value.fa;
}

/** Shared SVG system map used by home SystemMap and service detail AppWindow. */
export function SystemMapDiagram({
  locale,
  nodes,
  mapLabel,
  animationKey,
  layout = "hub",
}: SystemMapDiagramProps) {
  const reduceMotion = useReducedMotion();
  const geometry = LAYOUTS[layout] ?? LAYOUTS.hub;
  const satelliteW = geometry.nodeWidth ?? NODE_W;

  return (
    <svg
      viewBox="0 0 560 260"
      role="img"
      aria-label={mapLabel}
      className="block h-auto w-full"
    >
      {geometry.extras?.map((d, index) => (
        <path
          key={`extra-${index}`}
          d={d}
          fill="none"
          stroke="var(--win-line)"
          strokeWidth={10}
          strokeLinecap="round"
          opacity={0.55}
        />
      ))}

      {geometry.edges.map((d, index) => (
        <path
          key={`edge-${index}`}
          d={d}
          fill="none"
          stroke="var(--sky)"
          strokeOpacity={0.6}
          strokeWidth={1.5}
          strokeDasharray="4 6"
          strokeLinecap="round"
          className={
            reduceMotion
              ? undefined
              : "animate-[kara-flow_var(--motion-flow)_linear_infinite]"
          }
        />
      ))}

      {NODE_ORDER.map((role, index) => {
        const center = geometry.centers[role];
        const isCore = role === "core";
        const label = pickLocalized(nodes[role], locale);
        const w = isCore ? CORE_W : satelliteW;
        const h = isCore ? CORE_H : NODE_H;
        const x = center.x - w / 2;
        const y = center.y - h / 2;

        return (
          <motion.g
            key={`${animationKey}-${layout}-${role}`}
            initial={reduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : {
                    delay: index * 0.07,
                    duration: 0.45,
                    ease: [0.2, 0.7, 0.2, 1],
                  }
            }
          >
            <rect
              x={x}
              y={y}
              width={w}
              height={h}
              rx={NODE_R}
              ry={NODE_R}
              fill={isCore ? "var(--win-node-core)" : "var(--win-node)"}
              stroke={isCore ? "var(--sky)" : "var(--win-node-line)"}
              strokeWidth={isCore ? 1.6 : 1}
            />

            <text
              x={center.x}
              y={center.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="var(--win-text)"
              style={{
                fontSize: isCore ? 12.5 : geometry.nodeWidth ? 11.5 : 12.5,
                fontWeight: isCore ? 700 : 500,
                fontFamily:
                  "var(--font-vazirmatn), ui-sans-serif, sans-serif",
              }}
            >
              {label}
            </text>
          </motion.g>
        );
      })}
    </svg>
  );
}
