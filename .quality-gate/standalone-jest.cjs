const path=require("node:path");
module.exports={
 rootDir:path.resolve(__dirname,".."),
 testEnvironment:"node",
 testMatch:["<rootDir>/Test/**/*.test.js"],
 transform:{"^.+\\.(js|cjs)$":path.join(__dirname,"standalone-transform.cjs")},
 collectCoverageFrom:["**/*.js","**/*.cjs","!Test/**","!.quality-gate/**","!node_modules/**","!coverage/**"],
 coverageDirectory:"coverage"
};