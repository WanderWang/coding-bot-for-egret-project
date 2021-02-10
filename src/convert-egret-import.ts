import * as path from 'path';
import { Project, SourceFile } from "ts-morph";
import { removeNamespaceCall } from './utils';

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



    const items = [
        { namespace: 'egret', object: 'Tween' },
        { namespace: 'egret', object: 'Ease' },
    ]
    const m = { moduleName: '@egret/tween', keys: ['Tween', 'Ease'] };

    // const items = [
    //     { namespace: 'egret', object: 'Tween' },
    //     { namespace: 'egret', object: 'Ease' },
    // ]
    // const m = { moduleName: '@egret/tween', keys: ['Tween', 'Ease'] };




    sourceFiles.forEach(removeNamespaceCall(items))



    sourceFiles.forEach(addImport(m));

    sourceFiles.forEach(s => {
        s.organizeImports();
    })

    project.saveSync();



}


function addImport(data: { moduleName: string, keys: string[] }) {
    return (s: SourceFile) => {
        // s.addImportDeclaration({
        //     namedImports: data.keys,
        //     moduleSpecifier: data.moduleName
        // })
        s.addImportDeclaration(
            {
                namespaceImport: 'eui',
                moduleSpecifier: '@egret/eui'
            }
        )
    }
}

const projectRoot = process.argv[2].split("\\").join("/")

run(projectRoot);