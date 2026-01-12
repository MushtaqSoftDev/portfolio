import { useEffect, useState } from "react";

const SYMBOL_COLUMNS = [
  ["</>", "{ }", "()", "=>", "-"],
  ["∑", "π", "∞", "λ", "+"],
  ["%", "√", "[ ]", "&", "*"],
];

const HeroSymbols = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 700);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  return (
    <>
      {/* SYMBOLS CONTAINER */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          paddingTop: "17rem", // 👈 pushes symbols BELOW hero heading
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "4rem",
            opacity: 0.85,
          }}
        >
          {SYMBOL_COLUMNS.map((column, colIndex) => (
            <div
              key={colIndex}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.75rem",
                animation: `columnFade 1s ease forwards`,
                animationDelay: `${colIndex * 0.25}s`,
                opacity: 0,
              }}
            >
              {column.map((symbol, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: "clamp(1.6rem, 3vw, 2.6rem)",
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.75)",
                    letterSpacing: "0.08em",
                    animation: `symbolFloat ${
                      4 + Math.random() * 3
                    }s ease-in-out infinite`,
                    animationDelay: `${i * 0.15}s`,
                  }}
                >
                  {symbol}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* INLINE STYLES */}
      <style>
        {`
          @keyframes columnFade {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes symbolFloat {
            0% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-8px);
            }
            100% {
              transform: translateY(0px);
            }
          }
        `}
      </style>
    </>
  );
};

export default HeroSymbols;

