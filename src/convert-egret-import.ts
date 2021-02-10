import * as path from 'path';
import { Project, SourceFile, ts, TypeNode } from "ts-morph";

async function run(projectPath: string) {

    function execute(s: SourceFile) {
        const allNamespaces = s.getNamespaces();
        for (let namespace of allNamespaces) {
            const statments = namespace.getStatementsWithComments();
            for (let statment of statments) {
                s.addStatements(statment.getText());
                statment.remove();
            }
            namespace.remove();

        }
    }

    const project = new Project({
        tsConfigFilePath: path.join(projectPath, 'tsconfig.json')
    });
    const sourceFiles = project.getSourceFiles().filter(s => !s.isDeclarationFile())
    sourceFiles.forEach(removeNamespaceCall)
    sourceFiles.forEach(addImport);

    sourceFiles.forEach(s => {
        s.organizeImports();
    })

    project.saveSync();


    async function addImport(s: SourceFile) {
        const data = { moduleName: '@egret/tween', keys: ['Tween', 'Ease'] };
        s.addImportDeclaration({
            namedImports: data.keys,
            moduleSpecifier: data.moduleName
        })
    }
}





async function removeNamespaceCall(source: SourceFile) {
    source.transform((traversal) => {

        const node = traversal.visitChildren();
        if (ts.isPropertyAccessExpression(node)) {
            const expression = node.expression;
            if (ts.isIdentifier(expression)) {
                if (expression.getText() === 'egret' && node.name.getText() === 'Tween') {
                    return node.name;
                }
                if (expression.getText() === 'egret' && node.name.getText() === 'Ease') {
                    return node.name;
                }
            }
        }

        if (ts.isTypeReferenceNode(node)) {
            const typeName = node.typeName;
            if (ts.isQualifiedName(typeName)) {
                if (typeName.left.getText() === 'egret' && typeName.right.getText() === 'Tween') {
                    const factory = ts.factory;
                    return factory.createTypeReferenceNode(
                        typeName.right,
                        undefined
                    )
                }
                if (typeName.left.getText() === 'egret' && typeName.right.getText() === 'Ease') {
                    const factory = ts.factory;
                    return factory.createTypeReferenceNode(
                        typeName.right,
                        undefined
                    )
                }
            }
        }

        return node;
    })
}

const projectRoot = process.argv[2].split("\\").join("/")

run(projectRoot);