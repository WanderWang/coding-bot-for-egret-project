import * as path from 'path';
import { NamespaceDeclarationKind, Project, SourceFile } from "ts-morph";

async function run(projectPath: string) {

    function execute(s: SourceFile) {

        const allNamespaces = s.getNamespaces();
        for (let namespace of allNamespaces) {
            const name = namespace.getName();
            if (name.indexOf(".") >= 0) {
                const tempArr = name.split('.');
                const [first, second] = tempArr;

                const wrapperNamespace = s.addNamespace({
                    name: first
                });
                const namespaceStrcture = namespace.getStructure();
                namespaceStrcture.name = second;
                namespaceStrcture.declarationKind = NamespaceDeclarationKind.Namespace;
                wrapperNamespace.addNamespace(namespaceStrcture);

            }
        }
    }

    const project = new Project({
        tsConfigFilePath: path.join(projectPath, 'tsconfig.json')
    });
    const sourceFiles = project.getSourceFiles();


    sourceFiles.forEach(execute);

    // project.saveSync();

}

const projectPath = './tests/complex-namespace'

run(projectPath);