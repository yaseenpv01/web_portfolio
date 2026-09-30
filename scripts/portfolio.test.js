import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const projects=JSON.parse(readFileSync(new URL('../src/projects.json',import.meta.url)));
test('all nine projects and their original store destinations are rendered',()=>{assert.equal(projects.length,9);for(const p of projects){for(const link of p.links)assert.ok(html.includes(link.url));}});
test('all local navigation anchors exist',()=>{for(const [,id] of html.matchAll(/href="#([^"]+)"/g))assert.ok(html.includes(`id="${id}"`),id);});
test('required assets and live form destination are preserved',()=>{for(const file of ['public/assets/img/yaseen_imgnew.png','public/Muhammed_Yaseen_PV_CV.pdf'])assert.ok(existsSync(file));assert.ok(html.includes('https://formspree.io/f/xbllqbpq'));});
