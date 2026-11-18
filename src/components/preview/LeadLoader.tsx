import { LeadLogo } from "@/components/brand/LeadLogo";
import { LOADER_DONE } from "@/lib/loader";

/**
 * A preview's first view in a tab opens on the business's own logo, on the site's cream paper: the mark's
 * outlines draw themselves, their fills come in, the name rises out of a mask, and the paper wipes up off the
 * page (like the menu closing) as the masthead rises. ~2.4 s; a click, key or scroll skips it; reduced motion
 * shows the finished logo for 0.6 s and fades. It's in the server HTML, so it's the first paint; a tiny inline
 * script right after it (before anything else is parsed) skips it on a reload in the same tab, times it, and
 * tells the hero when to start (lib/loader.ts). The CSS hides it at 3 s whatever happens.
 */
export function LeadLoader({ token, svg }: { token: string; svg: string }) {
  const script = `(function(){var d=document.documentElement,k=${JSON.stringify(`lead-loader:${token}`)},seen=false;
try{seen=sessionStorage.getItem(k)==="1";sessionStorage.setItem(k,"1")}catch(e){}
if(seen||!document.getElementById("lead-loader")){d.setAttribute("data-loader","skip");return}
d.setAttribute("data-loading","");
var rm=matchMedia("(prefers-reduced-motion: reduce)").matches,out=false,ev=["pointerdown","keydown","wheel","touchstart"],t;
function skip(){exit(true)}
function exit(fast){if(out)return;out=true;clearTimeout(t);ev.forEach(function(e){removeEventListener(e,skip,true)});
d.setAttribute("data-loader",rm?"fade":fast?"skip-out":"out");d.removeAttribute("data-loading");
try{dispatchEvent(new Event(${JSON.stringify(LOADER_DONE)}))}catch(e){}
setTimeout(function(){d.setAttribute("data-loader","done")},rm?420:fast?520:860)}
t=setTimeout(function(){exit(false)},rm?600:1600);
ev.forEach(function(e){addEventListener(e,skip,{capture:true,passive:true})})})();`;
  return (
    <>
      <div id="lead-loader" className="lead-loader theme-cream" aria-hidden>
        <LeadLogo svg={svg} className="lead-loader__logo" />
      </div>
      <script dangerouslySetInnerHTML={{ __html: script }} />
    </>
  );
}
