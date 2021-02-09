import * as path from 'path';
import { NamespaceDeclarationKind, Project, SourceFile } from "ts-morph";

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
        console.log(s.print())
    }

    const project = new Project({
        tsConfigFilePath: path.join(projectPath, 'tsconfig.json')
    });
    const sourceFiles = project.getSourceFiles();


    sourceFiles.forEach(execute);

    // project.saveSync();

}

const projectPath = './tests/convert-to-es6-module'

run(projectPath);