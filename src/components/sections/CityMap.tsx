import clsx from "clsx";

/**
 * Stylised map of Dorćol / Stari grad (not to scale). Drawn in SVG so it is
 * crisp, on-brand and doesn't load a third-party map. The pin pulses.
 */
export function CityMap({ className, label }: { className?: string; label: string }) {
  return (
    <figure className={clsx("relative overflow-hidden bg-ink-2", className)}>
      <svg viewBox="0 0 800 600" className="h-full w-full" role="img" aria-label={label}>
        <rect width="800" height="600" fill="#1a1415" />
        {/* Danube + Sava */}
        <path d="M-20 90 C 180 60, 360 40, 520 10 L 820 -30 L 820 -60 L -20 -60 Z" fill="#251d1e" />
        <path d="M-20 90 C 180 60, 360 40, 520 10 L 820 -30" fill="none" stroke="#b89468" strokeOpacity=".35" strokeWidth="1.5" />
        <path d="M-40 420 C 20 360, 40 300, 30 220 C 25 170, 40 120, 90 80" fill="none" stroke="#b89468" strokeOpacity=".35" strokeWidth="1.5" />
        <path d="M-40 420 C 20 360, 40 300, 30 220 C 25 170, 40 120, 90 80 L -40 80 Z" fill="#251d1e" />
        {/* Kalemegdan park */}
        <path d="M80 120 C 140 90, 220 80, 250 110 C 270 150, 230 210, 170 230 C 120 240, 80 200, 70 160 Z" fill="#5a1a29" fillOpacity=".35" />
        <text x="118" y="170" fill="#c6a08a" fontSize="13" letterSpacing="3" fontFamily="sans-serif">KALEMEGDAN</text>
        {/* Streets */}
        <g stroke="#f4ede4" strokeOpacity=".16" strokeWidth="1.2" fill="none">
          <path d="M240 600 L 330 330 L 420 120 L 470 20" />
          <path d="M120 600 L 250 250" />
          <path d="M200 330 L 800 250" />
          <path d="M230 420 L 800 350" />
          <path d="M260 520 L 800 460" />
          <path d="M520 600 L 560 40" />
          <path d="M660 600 L 700 20" />
          <path d="M300 200 L 800 140" />
          <path d="M380 600 L 430 60" />
        </g>
        {/* Named streets */}
        <g stroke="#f4ede4" strokeOpacity=".5" strokeWidth="2.2" fill="none">
          <path id="knez" d="M160 560 L 250 250" />
          <path id="cara" d="M330 330 L 420 120 L 470 20" />
          <path id="strahinjica" d="M230 420 L 800 350" />
          <path id="dobracina" d="M200 330 L 800 250" />
        </g>
        <g fill="#f4ede4" fillOpacity=".7" fontSize="12" letterSpacing="1.5" fontFamily="sans-serif">
          <text>
            <textPath href="#knez" startOffset="18%">KNEZ MIHAILOVA</textPath>
          </text>
          <text>
            <textPath href="#cara" startOffset="30%">CARA DUŠANA</textPath>
          </text>
          <text dy="-8">
            <textPath href="#strahinjica" startOffset="38%">STRAHINJIĆA BANA</textPath>
          </text>
          <text dy="-8">
            <textPath href="#dobracina" startOffset="48%">DOBRAČINA</textPath>
          </text>
        </g>
        <text x="600" y="60" fill="#c6a08a" fontSize="13" letterSpacing="4" fontFamily="sans-serif" fontStyle="italic">DUNAV</text>
        <text x="40" y="400" fill="#c6a08a" fontSize="13" letterSpacing="4" fontFamily="sans-serif" transform="rotate(-70 40 400)">SAVA</text>
        {/* Pin */}
        <g transform="translate(470 381)">
          <circle r="34" fill="#b89468" fillOpacity=".15">
            <animate attributeName="r" values="14;40;14" dur="3s" repeatCount="indefinite" />
            <animate attributeName="fill-opacity" values=".35;0;.35" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle r="9" fill="#f4ede4" />
          <circle r="4" fill="#5a1a29" />
        </g>
        <g transform="translate(492 420)">
          <rect width="170" height="48" rx="24" fill="#f4ede4" />
          <text x="22" y="30" fill="#0f0b0c" fontSize="16" fontFamily="serif" fontStyle="italic">Ondine · br. 44</text>
        </g>
      </svg>
    </figure>
  );
}
