"use client";

import React, { useRef, useState } from "react";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { useTheme, type ThemeMode } from "@/app/contexts/ThemeContext";

interface Plug {
  mode: ThemeMode;
  /** Cable and plug body colour. Fixed in every theme — a blue cable is blue. */
  cable: string;
}

const PLUGS: Plug[] = [
  { mode: "blue", cable: "#3b82f6" },
  { mode: "yellow", cable: "#ffc72c" },
  { mode: "white", cable: "#f4f4f5" },
];

/**
 * `short` is what fits under a 52px plug; the full theme name goes in the
 * aria-label, so a screen reader still hears which theme it switches to.
 */
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

/**
 * Three cables and a socket in the footer. Plugging one in switches the theme.
 *
 * A second, playful route to something the header menu already does, and
 * deliberately not the only route — anyone who does not spot it, or cannot
 * drag, still has the menu.
 *
 * Dragging is an enhancement rather than the mechanism: a plain click or tap on
 * a plug also plugs it in, so it works on a phone and from the keyboard.
 * Pointer events cover mouse and touch in one path, and touch-action: none is
 * set on the plugs alone so dragging one never fights the page scroll.
 */
export const PowerPlug: React.FC = () => {
  const { language } = useLanguage();
  const { themeMode, changeTheme } = useTheme();
  const l = labels[language] || labels.de;

  const socketRef = useRef<HTMLDivElement>(null);
  const movedRef = useRef(0);
  const [dragging, setDragging] = useState<ThemeMode | null>(null);
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null);

  const endDrag = () => {
    setDragging(null);
    setPointer(null);
  };

  const onPointerDown = (event: React.PointerEvent, mode: ThemeMode) => {
    movedRef.current = 0;
    setDragging(mode);
    setPointer({ x: event.clientX, y: event.clientY });
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent) => {
    if (!dragging) return;
    movedRef.current += Math.abs(event.movementX) + Math.abs(event.movementY);
    setPointer({ x: event.clientX, y: event.clientY });
  };

  const onPointerUp = (event: React.PointerEvent, plug: Plug) => {
    const socket = socketRef.current?.getBoundingClientRect();
    const onSocket =
      !!socket &&
      event.clientX >= socket.left &&
      event.clientX <= socket.right &&
      event.clientY >= socket.top &&
      event.clientY <= socket.bottom;

    // A press that never really moved counts as plugging in, so the whole
    // thing is usable without dragging at all.
    const tapped = movedRef.current < 6;

    endDrag();
    if (onSocket || tapped) changeTheme(plug.mode);
  };

  return (
    <div className="power-plug">
      <p className="power-plug-hint">{l.hint}</p>

      {/* Row and socket share one shrink-wrapped box so the socket can centre
          itself under the plugs instead of hanging off to the left. */}
      <div className="power-plug-stage">
        <div className="power-plug-row">
          {PLUGS.map((plug) => {
            const isDragging = dragging === plug.mode;
            return (
              <button
                key={plug.mode}
                type="button"
                className={`plug${themeMode === plug.mode ? " plug-live" : ""}${
                  isDragging ? " plug-dragging" : ""
                }`}
                style={{
                  ["--cable" as string]: plug.cable,
                  ...(isDragging && pointer
                    ? { left: `${pointer.x}px`, top: `${pointer.y}px` }
                    : {}),
                }}
                aria-label={`${l.action} ${l[plug.mode].full}`}
                aria-pressed={themeMode === plug.mode}
                onPointerDown={(e) => onPointerDown(e, plug.mode)}
                onPointerMove={onPointerMove}
                onPointerUp={(e) => onPointerUp(e, plug)}
                onPointerCancel={endDrag}
              >
                <span className="plug-cable" />
                <span className="plug-body">
                  <span className="plug-pin" />
                  <span className="plug-pin" />
                </span>
                <span className="plug-name">{l[plug.mode].short}</span>
              </button>
            );
          })}
        </div>

        <div
          ref={socketRef}
          className={`socket${dragging ? " socket-ready" : ""}`}
          aria-hidden="true"
        >
          <span className="socket-hole" />
          <span className="socket-hole" />
        </div>
      </div>
    </div>
  );
};
