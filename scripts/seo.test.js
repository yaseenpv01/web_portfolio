import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync,existsSync } from 'node:fs';
const origin='https://yaseenmuhammed.com';
const routes=['/','/projects/inaxus/','/projects/fgic-attendance/','/projects/local-ai-document-parser/'];
const sitemap=readFileSync('public/sitemap.xml','utf8');
for(const route of routes){
 test(`SEO contract for ${route}`,()=>{
  const html=readFileSync(`dist${route}index.html`,'utf8');
  assert.equal((html.match(/<h1\b/g)||[]).length,1);
  assert.ok(html.includes(`<link rel="canonical" href="${origin}${route}"`));
  assert.ok(sitemap.includes(`<loc>${origin}${route}</loc>`));
  assert.ok(/<title>[^<]*Muhammed Yaseen/.test(html));
  assert.ok(!html.includes('noindex'));
  const json=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
  assert.ok(json['@graph'].some(x=>x['@id']===`${origin}${route}${route==='/'?'#profile':'#page'}`));
  assert.ok(html.includes('og-image.jpg'));
  for(const [,url] of html.matchAll(/(?:href|src)="([^"]+)"/g)){
   if(/^(https?:|mailto:|tel:|#|data:)/.test(url))continue;
   const resolved=new URL(url,`${origin}${route}`);
   const path=`dist${resolved.pathname}`;
   assert.ok(existsSync(path),`Missing built target ${path}`);
  }
 });
}
test('homepage profile is linked to verified identity and visible name',()=>{
 const html=readFileSync('dist/index.html','utf8');
 assert.match(html,/<h1[^>]*>Muhammed Yaseen/);
 const graph=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1])['@graph'];
 assert.ok(graph.find(x=>x['@type']==='ProfilePage').mainEntity['@id']===origin+'/#person');
 assert.equal(graph.find(x=>x['@type']==='Person').sameAs.length,3);
});
test('legacy resume redirects and the homepage stays indexable',()=>{
 const config=JSON.parse(readFileSync('vercel.json'));
 assert.equal(config.redirects.find(x=>x.source==='/Muhammed_Yaseen_Resume.pdf').destination,'/Muhammed_Yaseen_PV_CV.pdf');
 assert.ok(config.headers.every(x=>x.source!=='/'&&x.source!=='/:path*'));
});
