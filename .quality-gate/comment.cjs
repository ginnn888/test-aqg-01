const fs=require("node:fs");
async function main(){
 const report=JSON.parse(fs.readFileSync("quality-report/quality-gate-report.json","utf8")),event=JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH,"utf8"));
 const target="https://github.com/"+process.env.GITHUB_REPOSITORY+"/actions/runs/"+process.env.GITHUB_RUN_ID;
 // pull_request_target runs on the base SHA: publish status explicitly on the PR head.
 const status=await fetch("https://api.github.com/repos/"+process.env.GITHUB_REPOSITORY+"/statuses/"+event.pull_request.head.sha,{method:"POST",headers:{Authorization:"Bearer "+process.env.GITHUB_TOKEN,Accept:"application/vnd.github+json","Content-Type":"application/json"},body:JSON.stringify({state:report.gate==="Passed"?"success":"failure",context:"Quality Gate",description:"Tests, coverage, audit and AI review",target_url:target}),signal:AbortSignal.timeout(20000)});
 if(!status.ok)throw new Error("Commit status HTTP "+status.status);
 const text="<!-- quality-gate -->\n## Quality Gate: "+report.gate+"\nCoverage: "+(report.coverage??"Unavailable")+"% / "+report.threshold+"%\nTests: "+report.testsStatus+"\nAI: "+report.ai.status+"\n[Full report](https://github.com/"+process.env.GITHUB_REPOSITORY+"/actions/runs/"+process.env.GITHUB_RUN_ID+")";
 const r=await fetch("https://api.github.com/repos/"+process.env.GITHUB_REPOSITORY+"/issues/"+event.pull_request.number+"/comments",{method:"POST",headers:{Authorization:"Bearer "+process.env.GITHUB_TOKEN,Accept:"application/vnd.github+json","Content-Type":"application/json"},body:JSON.stringify({body:text}),signal:AbortSignal.timeout(20000)});
 if(!r.ok)throw new Error("PR comment HTTP "+r.status);
}
module.exports={main};if(require.main===module)main().catch(e=>{console.error(e.message);process.exitCode=1;});
