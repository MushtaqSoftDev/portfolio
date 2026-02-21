import { useEffect, useRef, useState, useCallback, useLayoutEffect } from "react";
import { createPortal } from "react-dom";

interface SymbolItem {
  id: string;
  symbol: string;
}

const INITIAL_SYMBOLS: SymbolItem[] = [
  { id: "s0", symbol: "</>" },
  { id: "s1", symbol: "∑" },
  { id: "s2", symbol: "%" },
  { id: "s3", symbol: "{ }" },
  { id: "s4", symbol: "π" },
  { id: "s5", symbol: "√" },
  { id: "s6", symbol: "()" },
  { id: "s7", symbol: "∞" },
  { id: "s8", symbol: "[ ]" },
  { id: "s9", symbol: "=" },
  { id: "s10", symbol: "λ" },
  { id: "s11", symbol: "&" },
];

const TILT_MAX = 12;
const TILT_SMOOTH = 0.12;
const COLS = 3;

const HeroSymbols = () => {
  const [visible, setVisible] = useState(false);
  const [animDone, setAnimDone] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [symbols, setSymbols] = useState(INITIAL_SYMBOLS);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });

  const panelRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef({ x: 0, y: 0 });
  const targetTiltRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const itemEls = useRef<Map<string, HTMLElement>>(new Map());
  const prevRectsRef = useRef<Map<string, DOMRect>>(new Map());

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 700);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setAnimDone(true), 1200);
    return () => clearTimeout(t);
  }, [visible]);

  // 3D tilt effect
  useEffect(() => {
    const container = containerRef.current;
    const panel = panelRef.current;
    if (!container || !panel) return;

    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetTiltRef.current = { x: -y * TILT_MAX, y: x * TILT_MAX };
    };

    const onLeave = () => {
      targetTiltRef.current = { x: 0, y: 0 };
      setIsHovering(false);
    };

    const onEnter = () => setIsHovering(true);

    const animate = () => {
      const target = targetTiltRef.current;
      tiltRef.current.x += (target.x - tiltRef.current.x) * TILT_SMOOTH;
      tiltRef.current.y += (target.y - tiltRef.current.y) * TILT_SMOOTH;
      panel.style.transform = `perspective(800px) rotateX(${tiltRef.current.x}deg) rotateY(${tiltRef.current.y}deg) scale3d(1.02, 1.02, 1.02)`;
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    container.addEventListener("mousemove", onMove, { passive: true });
    container.addEventListener("mouseleave", onLeave);
    container.addEventListener("mouseenter", onEnter);
    return () => {
      container.removeEventListener("mousemove", onMove);
      container.removeEventListener("mouseleave", onLeave);
      container.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(rafRef.current);
    };
  }, [visible]);

  // FLIP animation: after symbols reorder, animate non-dragged items from old to new positions
  useLayoutEffect(() => {
    const prev = prevRectsRef.current;
    if (prev.size === 0) return;

    const toAnimate: { el: HTMLElement; dx: number; dy: number }[] = [];

    itemEls.current.forEach((el, id) => {
      if (id === dragId) return;
      const oldRect = prev.get(id);
      if (!oldRect) return;
      const newRect = el.getBoundingClientRect();
      const dx = oldRect.left - newRect.left;
      const dy = oldRect.top - newRect.top;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
      toAnimate.push({ el, dx, dy });
    });

    prevRectsRef.current = new Map();

    if (toAnimate.length === 0) return;

    for (const { el, dx, dy } of toAnimate) {
      el.style.transition = "none";
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    }

    // Force reflow so the inverse transforms are applied before transitioning
    void document.body.offsetHeight;

    for (const { el } of toAnimate) {
      el.style.transition = "transform 0.2s cubic-bezier(0.25, 0.1, 0.25, 1)";
      el.style.transform = "";
    }
  }, [symbols, dragId]);

  // Drag-and-drop via pointer events
  const handlePointerDown = useCallback(
    (e: React.PointerEvent, id: string) => {
      if (!animDone) return;
      e.preventDefault();

      setDragId(id);
      setDragPos({ x: e.clientX, y: e.clientY });

      const onMove = (ev: PointerEvent) => {
        setDragPos({ x: ev.clientX, y: ev.clientY });

        let targetId: string | null = null;
        const rects = new Map<string, DOMRect>();

        itemEls.current.forEach((el, elId) => {
          const rect = el.getBoundingClientRect();
          rects.set(elId, rect);
          if (elId === id) return;
          if (
            ev.clientX >= rect.left &&
            ev.clientX <= rect.right &&
            ev.clientY >= rect.top &&
            ev.clientY <= rect.bottom
          ) {
            targetId = elId;
          }
        });

        if (!targetId) return;

        prevRectsRef.current = rects;

        setSymbols((prev) => {
          const dragIdx = prev.findIndex((s) => s.id === id);
          const tgtIdx = prev.findIndex((s) => s.id === targetId);
          if (dragIdx === -1 || tgtIdx === -1 || dragIdx === tgtIdx) return prev;
          const next = [...prev];
          const [removed] = next.splice(dragIdx, 1);
          next.splice(tgtIdx, 0, removed);
          return next;
        });
      };

      const onUp = () => {
        setDragId(null);
        document.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerup", onUp);
      };

      document.addEventListener("pointermove", onMove);
      document.addEventListener("pointerup", onUp);
    },
    [animDone],
  );

  if (!visible) return null;

  const dragSymbol = dragId ? symbols.find((s) => s.id === dragId)?.symbol : null;

  return (
    <>
      <div className="hero-symbols-container">
        <div ref={containerRef} className="hero-3d-panel-wrapper">
          <div
            ref={panelRef}
            className={`hero-3d-panel ${isHovering ? "hero-3d-panel--hover" : ""}`}
          >
            <div className="hero-3d-panel__grid" aria-hidden />
            <div className="hero-3d-panel__scan" aria-hidden />

            <div className="hero-3d-panel__symbols">
              {symbols.map((item) => {
                const isDragging = dragId === item.id;
                const initialIdx = INITIAL_SYMBOLS.findIndex((s) => s.id === item.id);
                const initialCol = initialIdx % COLS;

                return (
                  <div
                    key={item.id}
                    ref={(el) => {
                      if (el) itemEls.current.set(item.id, el);
                      else itemEls.current.delete(item.id);
                    }}
                    className={`hero-symbol-cell${isDragging ? " hero-symbol-cell--dragging" : ""}`}
                    onPointerDown={(e) => handlePointerDown(e, item.id)}
                    style={{
                      cursor: animDone ? (isDragging ? "grabbing" : "grab") : "default",
                      ...(animDone
                        ? { opacity: isDragging ? 0.2 : 1 }
                        : {
                            animation: "columnFade 1s ease forwards",
                            animationDelay: `${initialCol * 0.25}s`,
                            opacity: 0,
                          }),
                    }}
                  >
                    <span
                      className="hero-symbol"
                      style={{
                        animation: isDragging
                          ? "none"
                          : `symbolFloat ${4 + ((initialIdx * 7) % 5) * 0.6}s ease-in-out infinite`,
                        animationDelay: `${((initialIdx * 3) % 4) * 0.15}s`,
                      }}
                    >
                      {item.symbol}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {dragId &&
        dragSymbol &&
        createPortal(
          <span
            className="hero-drag-overlay"
            style={{ left: dragPos.x, top: dragPos.y }}
          >
            {dragSymbol}
          </span>,
          document.body,
        )}
    </>
  );
};

export default HeroSymbols;
