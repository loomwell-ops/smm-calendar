// Rebuilds calendar-demo.html from index.html.
// Run:  node build-demo.mjs        (needs Node 18+)
// The demo has no Supabase connection, no service worker and no install manifest. Only the built-in sample data works.
import { readFileSync, writeFileSync } from 'node:fs';

const OUT = 'calendar-demo.html';
const fail = m => { console.error('\n[X] Demo build failed: ' + m + '\n'); process.exit(1); };
const must = (src, re, rep, label) => {
  if (!re.test(src)) fail(`${label} was not found. The source code changed, so update that pattern in build-demo.mjs (or ask Claude).`);
  return src.replace(re, () => rep);
};
const maybe = (src, from, to) => (src.includes(from) ? src.replace(from, to) : (console.warn('  note: optional text not found: ' + from.slice(0, 50)), src));

let h = readFileSync('index.html', 'utf8');

const url = h.match(/const SB_URL\s*=\s*'([^']+)'/), key = h.match(/const SB_KEY\s*=\s*'([^']+)'/);
if (!url || !key) fail('SB_URL / SB_KEY were not found in index.html.');
const secrets = [url[1], key[1]];
if (!h.includes('function startDemo(')) fail('startDemo() is missing from index.html, so the built-in demo mode is gone.');

const stub =
  "const realSb={auth:{getSession:async()=>({data:{session:null}}),onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}})," +
  "signInWithPassword:async()=>({error:{message:'Sign-in is turned off in this demo. Use one of the demo buttons below.'}})," +
  "signUp:async()=>({error:{message:'Not available in the demo.'}}),resetPasswordForEmail:async()=>({error:{message:'Not available in the demo.'}})," +
  "updateUser:async()=>({error:{message:'Not available in the demo.'}}),signOut:async()=>({error:null})}," +
  "channel:()=>({on(){return this},subscribe(){return this}}),removeChannel(){}};";

h = must(h, /\s*<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/@supabase[^>]*><\/script>/, '', 'The Supabase script tag');
h = must(h, /const SB_URL\s*=\s*'[^']*';\s*const SB_KEY\s*=\s*'[^']*';/, "const SB_URL='',SB_KEY='';", 'SB_URL / SB_KEY');
h = must(h, /const realSb\s*=\s*supabase\.createClient\(SB_URL,\s*SB_KEY\);/, stub, 'The realSb = supabase.createClient(...) line');
h = must(h, /navigator\.serviceWorker\.register\('sw\.js'\)\.catch\(\(\)=>\{\}\)/, '0', 'The service worker registration');
h = must(h, /\s*<link rel="manifest" href="manifest\.webmanifest">/, '<meta name="robots" content="noindex">', 'The manifest link');
h = maybe(h, 'Demo mode: sample data, nothing is saved.', 'Live demo: sample data only, nothing is saved.');

for (const s of secrets) if (h.includes(s)) fail(`${OUT} still contains a private config value (${s.slice(0, 18)}...).`);
if (/supabase\.min\.js|createClient\(|sb_publishable/.test(h)) fail(`${OUT} still loads or creates a real Supabase client.`);

writeFileSync(OUT, h);
console.log(`OK: ${OUT} rebuilt (${(h.length / 1024).toFixed(0)} KB). Safety check passed.`);
