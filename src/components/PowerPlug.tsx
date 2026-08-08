"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { useTheme, type ThemeMode } from "@/app/contexts/ThemeContext";

interface Plug {
  mode: ThemeMode;
  cable: string;
  body: string;
}

const PLUGS: Plug[] = [
  { mode: "blue", cable: "#3b82f6", body: "#3b82f6" },
  { mode: "yellow", cable: "#f97316", body: "#ffc72c" },
  { mode: "white", cable: "#18181b", body: "#ffffff" },
];

const labels = {
  de: {
    hint: "Stecker einstecken und der Website Strom geben.",
    action: "Thema wechseln zu",
    blue: { short: "Blau", full: "Mitternachtsblau" },
    yellow: { short: "Gelb", full: "Sonnengelb" },
    white: { short: "Weiss", full: "Schwarz-Weiss" },
  },
  tr: {
    hint: "Fişi prize tak, siteye elektrik ver.",
    action: "Temayı değiştir:",
    blue: { short: "Mavi", full: "Gece Mavisi" },
    yellow: { short: "Sarı", full: "Güneş" },
    white: { short: "Beyaz", full: "Siyah Beyaz" },
  },
  en: {
    hint: "Plug it in and give the site power.",
    action: "Switch theme to",
    blue: { short: "Blue", full: "Midnight Blue" },
    yellow: { short: "Yellow", full: "Sunlit Yellow" },
    white: { short: "White", full: "Black & White" },
  },
};

export const PowerPlug: React.FC = () => {
  const { language } = useLanguage();
  const { themeMode, changeTheme } = useTheme();
  const l = labels[language] || labels.de;

  const stageRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<HTMLDivElement>(null);
  const plugRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const movedRef = useRef(0);
  const [dragging, setDragging] = useState<ThemeMode | null>(null);
  /**
   * Pointer position in both frames at once: viewport coordinates place the
   * dragged plug, which is position: fixed, and stage coordinates draw the
   * cable. Both are captured from the same event so a scroll mid-drag cannot
   * put them out of step.
   */
  const [pointer, setPointer] = useState<{
    clientX: number;
    clientY: number;
    stageX: number;
    stageY: number;
  } | null>(null);

  /**
   * Where each plug hangs when it is not being dragged, in stage coordinates.
   *
   * Only this is state. The cable paths themselves are worked out during
   * render, because deriving them into state meant every pointermove set state
   * twice — once for the pointer, then again from an effect for the paths — and
   * rendered twice for one move of the mouse.
   */
  const [anchors, setAnchors] = useState<
    Record<string, { x: number; y: number }>
  >({});

  const measureAnchors = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const stageRect = stage.getBoundingClientRect();
    if (stageRect.width === 0) return;

    const next: Record<string, { x: number; y: number }> = {};
    PLUGS.forEach((plug) => {
      const el = plugRefs.current[plug.mode];
      if (!el) return;
      const r = el.getBoundingClientRect();
      next[plug.mode] = {
        x: r.left - stageRect.left + r.width / 2,
        y: Math.max(0, r.top - stageRect.top),
      };
    });

    // Bail out when nothing moved, otherwise a resize or a re-measure would
    // hand back a fresh object and re-render for no reason.
    setAnchors((prev) => {
      const same =
        Object.keys(next).length === Object.keys(prev).length &&
        Object.entries(next).every(
          ([k, v]) => prev[k] && prev[k].x === v.x && prev[k].y === v.y,
        );
      return same ? prev : next;
    });
  }, []);

  // Layout only shifts when a plug moves in or out of the socket, or the window
  // resizes — never while the pointer moves.
  useEffect(() => {
    measureAnchors();
    const frame = requestAnimationFrame(measureAnchors);
    window.addEventListener("resize", measureAnchors);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", measureAnchors);
    };
  }, [measureAnchors, themeMode]);

  const cablePathFor = (plug: Plug): string => {
    const anchor = anchors[plug.mode];
    if (!anchor) return "";

    const startX = anchor.x;
    const startY = 0;
    const isDragging = dragging === plug.mode;
    const isPluggedIn = themeMode === plug.mode;

    const endX = isDragging && pointer ? pointer.stageX : anchor.x;
    const endY = isDragging && pointer ? pointer.stageY - 12 : anchor.y;

    if (!isDragging && !isPluggedIn) {
      // Resting: a straight drop from the ceiling to the plug head.
      return `M ${startX} ${startY} L ${startX} ${endY}`;
    }

    // Dragged or plugged in: let the cable sag behind the head.
    const dx = endX - startX;
    const dy = endY - startY;
    const sag = Math.max(15, Math.min(60, dy * 0.35 + Math.abs(dx) * 0.25));

    const cp1X = startX + dx * 0.1;
    const cp1Y = startY + sag;
    const cp2X = endX - dx * 0.1;
    const cp2Y = endY - sag * 0.4;

    return `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;
  };

  const toPointer = (event: React.PointerEvent) => {
    const stageRect = stageRef.current?.getBoundingClientRect();
    return {
      clientX: event.clientX,
      clientY: event.clientY,
      stageX: event.clientX - (stageRect?.left ?? 0),
      stageY: event.clientY - (stageRect?.top ?? 0),
    };
  };

  const endDrag = () => {
    setDragging(null);
    setPointer(null);
  };

  const onPointerDown = (event: React.PointerEvent, mode: ThemeMode) => {
    movedRef.current = 0;
    setDragging(mode);
    setPointer(toPointer(event));
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent) => {
    if (!dragging) return;
    movedRef.current += Math.abs(event.movementX) + Math.abs(event.movementY);
    setPointer(toPointer(event));
  };

  const onPointerUp = (event: React.PointerEvent, plug: Plug) => {
    const socket = socketRef.current?.getBoundingClientRect();
    const onSocket =
      !!socket &&
      event.clientX >= socket.left &&
      event.clientX <= socket.right &&
      event.clientY >= socket.top &&
      event.clientY <= socket.bottom;

    const tapped = movedRef.current < 6;

    endDrag();
    if (onSocket || tapped) changeTheme(plug.mode);
  };

  return (
    <div className="power-plug">
      <p className="power-plug-hint">{l.hint}</p>

      <div ref={stageRef} className="power-plug-stage relative">
        {/* Dynamic SVG Cables Layer */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
          {PLUGS.map((plug) => (
            <path
              key={plug.mode}
              d={cablePathFor(plug)}
              stroke={plug.cable}
              strokeWidth={dragging === plug.mode ? "4.5" : "3.5"}
              strokeLinecap="round"
              fill="none"
              style={{
                filter: "drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.25))",
                transition: dragging === plug.mode ? "none" : "d 0.25s ease, stroke-width 0.2s ease",
              }}
            />
          ))}
        </svg>

        {/* Unplugged resting row */}
        <div className="power-plug-row z-10 relative min-h-[58px]">
          {PLUGS.map((plug) => {
            const isDragging = dragging === plug.mode;
            const isPluggedIn = themeMode === plug.mode && !isDragging;

            // Active plug sits inside socket container below!
            if (isPluggedIn) {
              return (
                <div key={plug.mode} className="w-[52px] h-[52px] flex-shrink-0" aria-hidden="true" />
              );
            }

            return (
              <button
                key={plug.mode}
                ref={(el) => {
                  plugRefs.current[plug.mode] = el;
                }}
                type="button"
                className={`plug${isDragging ? " plug-dragging" : ""}`}
                style={{
                  ["--cable" as string]: plug.cable,
                  ["--plug-body" as string]: plug.body,
                  ...(isDragging && pointer
                    ? { left: `${pointer.clientX}px`, top: `${pointer.clientY}px` }
                    : {}),
                }}
                aria-label={`${l.action} ${l[plug.mode].full}`}
                aria-pressed={false}
                onPointerDown={(e) => onPointerDown(e, plug.mode)}
                onPointerMove={onPointerMove}
                onPointerUp={(e) => onPointerUp(e, plug)}
                onPointerCancel={endDrag}
              >
                <span className="plug-body">
                  <span className="plug-pin" />
                  <span className="plug-pin" />
                </span>
                <span className="plug-name">{l[plug.mode].short}</span>
              </button>
            );
          })}
        </div>

        {/* Socket with Active Plug Inserted */}
        <div
          ref={socketRef}
          className={`socket z-10 relative mt-3${dragging ? " socket-ready" : ""}`}
          aria-hidden="true"
        >
          <span className="socket-hole" />
          <span className="socket-hole" />

          {/* Active theme plug head sitting plugged inside socket */}
          {PLUGS.map((plug) => {
            const isPluggedIn = themeMode === plug.mode && dragging !== plug.mode;
            if (!isPluggedIn) return null;

            return (
              <button
                key={plug.mode}
                ref={(el) => {
                  plugRefs.current[plug.mode] = el;
                }}
                type="button"
                className="plug plug-inserted absolute -top-4 left-1/2 -translate-x-1/2 z-20 cursor-pointer"
                style={{
                  ["--cable" as string]: plug.cable,
                  ["--plug-body" as string]: plug.body,
                }}
                aria-label={`${l.action} ${l[plug.mode].full}`}
                aria-pressed={true}
                onPointerDown={(e) => onPointerDown(e, plug.mode)}
                onPointerMove={onPointerMove}
                onPointerUp={(e) => onPointerUp(e, plug)}
                onPointerCancel={endDrag}
              >
                <span className="plug-body shadow-lg">
                  <span className="plug-pin plug-pin-inserted" />
                  <span className="plug-pin plug-pin-inserted" />
                </span>
                <span className="plug-name font-bold">{l[plug.mode].short}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
