/**
 * The phone page's one small salon touch: a pair of scissors runs along the hairline
 * above the price list and snips it, once, then leaves (PhoneMotion starts it; globals.css
 * animates transform and opacity only). Without motion it's a quiet rule with scissors resting on it.
 */
export function SnipRule() {
  return (
    <div data-snip aria-hidden className="relative mb-3 hidden h-5 text-wine [container-type:inline-size] phone:block">
      <span className="snip-line absolute inset-x-0 top-1/2 h-px bg-line" />
      <svg viewBox="0 0 32 20" className="snip-scissors absolute left-0 top-0 h-5 w-8 bg-bg pr-1" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
        <g className="snip-blade-a">
          <circle cx="4.6" cy="15" r="3" />
          <path d="M7.2 13.4 L29 3.6" />
        </g>
        <g className="snip-blade-b">
          <circle cx="4.6" cy="5" r="3" />
          <path d="M7.2 6.6 L29 16.4" />
        </g>
      </svg>
    </div>
  );
}
