const fs=require('node:fs'),cp=require('node:child_process'),path=require('node:path')
const root=path.resolve(__dirname,'..'),out=path.join(root,'output/mobile-parity-20261021')
const files=cp.execFileSync('git',['ls-tree','-r','--name-only','bc0980a'],{cwd:root,encoding:'utf8'}).trim().split('\n')
const sources={}
for(const file of files.filter(f=>/\.(html|css|js|json|mjs)$/.test(f))){const saved=path.join(out,'baseline-source',file);sources[path.join(root,file).replaceAll('\\','/')]=fs.existsSync(saved)?fs.readFileSync(saved,'utf8'):cp.execFileSync('git',['show','bc0980a:'+file],{cwd:root,encoding:'utf8',maxBuffer:8e6})}
fs.writeFileSync(path.join(out,'baseline-test-sources.json'),JSON.stringify(sources))
const tests=files.filter(f=>/^tests\/.*\.test\.mjs$/.test(f))
const result=cp.spawnSync(process.execPath,['--test','--test-reporter=tap','--import','./tests/mobile-parity-baseline-loader.mjs',...tests],{cwd:root,encoding:'utf8',maxBuffer:128e6})
fs.writeFileSync(path.join(out,'baseline-node-suite.txt'),(result.stdout||'')+'\n'+(result.stderr||''))
const parse=f=>{const s=fs.readFileSync(path.join(out,f),'utf8');return {summary:s.match(/^# (?:tests|pass|fail|skipped) .+$/gm),failed:[...s.matchAll(/^not ok \d+ - (.+)$/gm)].map(m=>m[1].replaceAll('\\','/').replace(/\/+/g,'/').replace(/^.*\/tests\//,'tests/'))}}
const baseline=parse('baseline-node-suite.txt'),updated=parse('node-suite.txt')
const report={baseline,updated,newFailures:updated.failed.filter(f=>!baseline.failed.includes(f)),fixedFailures:baseline.failed.filter(f=>!updated.failed.includes(f))}
fs.writeFileSync(path.join(out,'suite-comparison.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2))
