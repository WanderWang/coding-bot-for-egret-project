import * as path from 'path';
import { NamespaceDeclarationKind, Project, SourceFile } from "ts-morph";

async function run(projectPath: string) {

    function execute(s: SourceFile) {
        console.log(1)
        const allNamespaces = s.getNamespaces();
        for (let namespace of allNamespaces) {
            console.log(2)
            const statments = namespace.getStatementsWithComments();
            for (let statment of statments) {
                s.addStatements(statment.getText());
                statment.remove();
            }
            namespace.remove();

        }
        console.log(s.print())
        process.exit();
    }

    const project = new Project({
        tsConfigFilePath: path.join(projectPath, 'tsconfig.json')
    });
    const sourceFiles = project.getSourceFiles().filter(s => !s.isDeclarationFile())


    sourceFiles.forEach(execute);

    // project.saveSync();

}

const projectPath = '../egret/packages/eui'

run(projectPath);