const fs=require('node:fs'),cp=require('node:child_process'),path=require('node:path')
const root=path.resolve(__dirname,'..'),out=path.join(root,'output/780-payback-20261021')
const tracked=cp.execFileSync('git',['ls-files','tests/*.test.mjs'],{cwd:root,encoding:'utf8'}).trim().split('\n')
const changed=cp.execFileSync('git',['diff','--name-only'],{cwd:root,encoding:'utf8'}).trim().split('\n'),sources={}
for(const file of changed){if(!/\.(?:js|mjs|css|json|html|md)$/.test(file))continue;sources[path.join(root,file).replaceAll('\\','/')]=cp.execFileSync('git',['show','HEAD:'+file],{cwd:root,encoding:'utf8',maxBuffer:8e6})}
fs.writeFileSync(path.join(out,'baseline-sources.json'),JSON.stringify(sources))
const results={}
for(const phase of ['baseline','updated']){
 const args=['--test','--test-reporter=tap',...(phase==='baseline'?['--import','./tests/780-baseline-loader.mjs']:[]),...tracked]
 const r=cp.spawnSync(process.execPath,args,{cwd:root,encoding:'utf8',maxBuffer:128e6})
 const text=(r.stdout||'')+'\n'+(r.stderr||'');fs.writeFileSync(path.join(out,phase+'-node-suite.txt'),text)
 results[phase]={exit:r.status,failed:[...text.matchAll(/^not ok \d+ - (.+)$/gm)].map(m=>m[1]),summary:text.match(/^# (?:tests|pass|fail|skipped) .+$/gm)}
}
results.newFailures=results.updated.failed.filter(f=>!results.baseline.failed.includes(f))
results.fixedFailures=results.baseline.failed.filter(f=>!results.updated.failed.includes(f))
fs.writeFileSync(path.join(out,'suite-comparison.json'),JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2))
