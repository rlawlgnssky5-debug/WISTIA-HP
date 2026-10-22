const fs=require('node:fs'),cp=require('node:child_process'),path=require('node:path')
const root=path.resolve(__dirname,'..'),out=path.join(root,'output/packages/regression');fs.mkdirSync(out,{recursive:true})
const names=['package-pricing','booking-draft','analytics','tracking-engagement','inquiry-funnel','audio-selection-autoplay','notion-availability','notion-personal-busy','calendar-holidays','calendar-refresh-safety','gone-pages']
const results=[]
for(const name of names){
 const result=cp.spawnSync(process.execPath,['tests/'+name+'.test.mjs'],{cwd:root,encoding:'utf8',maxBuffer:8e6})
 fs.writeFileSync(path.join(out,name+'.txt'),(result.stdout||'')+'\n'+(result.stderr||''))
 const entry={name,status:result.status,error:result.error?.message}
 if(['analytics','gone-pages'].includes(name)&&result.status!==0){
  const baseline=cp.spawnSync(process.execPath,['--import','./tests/package-baseline-loader.mjs','tests/'+name+'.test.mjs'],{cwd:root,encoding:'utf8',maxBuffer:8e6})
  fs.writeFileSync(path.join(out,name+'-baseline.txt'),(baseline.stdout||'')+'\n'+(baseline.stderr||''));entry.baselineStatus=baseline.status
 }
 results.push(entry);console.log(JSON.stringify(entry))
}
const protectedFiles=['js/analytics.js','js/meta-pixel.js','js/tracking-common.js','js/inquiry-funnel.js','js/contact-form.js','js/before-after.js','js/ar-ratio-cd.js','js/ratio-model.js','api/availability.js']
const unchanged=protectedFiles.map(file=>({file,unchanged:fs.readFileSync(path.join(root,file)).toString('utf8').replace(/\r\n/g,'\n')===cp.execFileSync('git',['-c','safe.directory='+root,'show','HEAD:'+file],{cwd:root,encoding:'utf8'}).replace(/\r\n/g,'\n')}))
const assets=cp.execFileSync('git',['-c','safe.directory='+root,'diff','--name-only','--','assets'],{cwd:root,encoding:'utf8'}).trim()
fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({results,unchanged,changedAssets:assets},null,2))
if(results.some(r=>r.status!==0&&r.baselineStatus!==r.status)||unchanged.some(f=>!f.unchanged)||assets)process.exitCode=1
