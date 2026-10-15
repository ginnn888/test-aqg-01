module.exports=require("babel-jest").createTransformer({
 babelrc:false,configFile:false,
 plugins:[function({types:t}){return {visitor:{Program(program,state){
  if(/[\\/]Test[\\/]|[\\/]\.quality-gate[\\/]/.test(state.filename||""))return;
  const names=[];
  for(const statement of program.node.body){
   if(t.isImportDeclaration(statement)||t.isExportDeclaration(statement))throw new Error("Standalone mode supports CommonJS scripts, not ESM");
   if((t.isFunctionDeclaration(statement)||t.isClassDeclaration(statement))&&statement.id)names.push(statement.id.name);
   if(t.isVariableDeclaration(statement))for(const declaration of statement.declarations)if(t.isIdentifier(declaration.id))names.push(declaration.id.name);
  }
  if(!names.length)return;
  program.pushContainer("body",t.ifStatement(
   t.binaryExpression("===",t.memberExpression(t.identifier("module"),t.identifier("exports")),t.identifier("exports")),
   t.expressionStatement(t.callExpression(t.memberExpression(t.identifier("Object"),t.identifier("assign")),
    [t.identifier("exports"),t.objectExpression([...new Set(names)].map(name=>t.objectProperty(t.identifier(name),t.identifier(name),false,true)))]
   ))
  ));
 }}};}]
});