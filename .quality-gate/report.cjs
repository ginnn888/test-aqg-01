const fs=require("node:fs");
function read(file){try{const text=fs.readFileSync(file,"utf8");return text.length<=1000000?JSON.parse(text):null;}catch{return null;}}
function evaluate({threshold,coverage,testStatus,aiStatus,findings=[]}){
 if(typeof threshold!=="number"||!Number.isFinite(threshold)||threshold<0||threshold>100)throw new Error("Invalid threshold");
 return testStatus==="success"&&aiStatus==="success"&&typeof coverage==="number"&&Number.isFinite(coverage)&&coverage>=threshold&&coverage<=100&&!findings.some(f=>f.severity==="critical")?"Passed":"Failed";
}
function main(){
 const event=read(process.env.GITHUB_EVENT_PATH),ai=read("ai/ai.json"),metrics=read("metrics/coverage-summary.json"),tests=read("metrics/test-results.json"),config=read(".quality-gate.json");
 if(!event?.pull_request||!config)throw new Error("Missing event/configuration");
 const valid=ai&&ai.repository===process.env.GITHUB_REPOSITORY&&String(ai.runId)===process.env.GITHUB_RUN_ID&&ai.headSha===event.pull_request.head.sha;
 const coverage=metrics?.total?.lines?.pct;
 const findings=valid&&Array.isArray(ai.findings)?ai.findings:[];
 const report={schemaVersion:1,repository:process.env.GITHUB_REPOSITORY,runId:process.env.GITHUB_RUN_ID,headSha:event.pull_request.head.sha,pr:event.pull_request.number,threshold:config.coverageThreshold,coverage:typeof coverage==="number"?coverage:null,passedTests:Number.isSafeInteger(tests?.numPassedTests)?tests.numPassedTests:null,failedTests:Number.isSafeInteger(tests?.numFailedTests)?tests.numFailedTests:null,testsStatus:process.env.TEST_STATUS||"error",ai:{status:valid?process.env.AI_STATUS:"error",summary:valid?String(ai.summary).slice(0,12000):"AI report unavailable",findings,model:valid?ai.model:null}};
 report.gate=evaluate({threshold:report.threshold,coverage:report.coverage,testStatus:report.testsStatus,aiStatus:report.ai.status,findings});
 fs.mkdirSync("quality-report",{recursive:true});fs.writeFileSync("quality-report/quality-gate-report.json",JSON.stringify(report));
 fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,"## Quality Gate: "+report.gate+"\nCoverage: "+report.coverage+"%; threshold: "+report.threshold+"%\n");
 if(report.gate!=="Passed")process.exitCode=1;
}
module.exports={evaluate,main};
if(require.main===module)main();
