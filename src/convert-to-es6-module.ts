import * as path from 'path';
import { Project, SourceFile, ts } from "ts-morph";

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


    // sourceFiles.forEach(execute);




    // sourceFiles.forEach(removeNamespaceCall)
    // sourceFiles.forEach(addImport);

    // sourceFiles.forEach(s => {
    //     s.organizeImports();
    // })
    extract();


    project.saveSync();


    async function extract() {
        const indexSourceFile = project.getSourceFileOrThrow('index.ts');
        for (let source of sourceFiles) {
            let relative = path.relative(path.dirname(indexSourceFile.getFilePath()), source.getFilePath())
                .split("\\").join("/")
                .replace('.ts', '');
            if (relative.charAt(0) !== '.') {
                relative = './' + relative;
            }
            indexSourceFile.addStatements(`export * from '${relative}';\n`)
        }

    }

    async function addImport(s: SourceFile) {
        const data = { filename: 'src/components/supportClasses/Range.ts', key: 'Range' };
        const importFileName = path.join(projectPath, data.filename)
        let relative = path.relative(path.dirname(s.getFilePath()), importFileName)
            .split("\\").join("/")
            .replace('.ts', '');
        if (relative.charAt(0) !== '.') {
            relative = './' + relative;
        }
        s.addImportDeclaration({
            namedImports: [{ name: data.key }],
            moduleSpecifier: relative
        })
    }
}





async function removeNamespaceCall(source: SourceFile) {
    source.transform((traversal) => {
        const node = traversal.visitChildren();
        if (ts.isPropertyAccessExpression(node)) {
            const expression = node.expression;
            if (ts.isIdentifier(expression)) {
                if (expression.getText() === 'eui') {
                    // console.log(node.getText())
                    return node.name;
                }
            }
        }

        if (ts.isTypeReferenceNode(node)) {
            const typeName = node.typeName;
            if (ts.isQualifiedName(typeName)) {
                if (typeName.left.getText() === 'eui') {
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

const projectPath = '../egret/packages/eui'

run(projectPath);