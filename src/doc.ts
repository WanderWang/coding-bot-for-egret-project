import { exec } from 'child_process';
import * as path from 'path';
import { ClassDeclaration, JSDocableNode, Project, SourceFile } from "ts-morph";


function executeJsDocs(node: JSDocableNode) {
    const jsdocs = node.getJsDocs();
    for (let jsdoc of jsdocs) {
        const tags = jsdoc.getTags();
        for (let tag of tags) {
            const tagName = tag.getTagName()
            if (tagName === 'version') {
                tag.remove();
            }
            if (tagName === 'platform') {
                tag.remove();
            }
        }
    }
}


async function run(projectPath: string) {

    function checkClass(clz: ClassDeclaration) {
        executeJsDocs(clz);
        clz.getMethods().forEach(executeJsDocs);
        clz.getProperties().forEach(executeJsDocs);
        clz.getGetAccessors().forEach(executeJsDocs);
    }


    function check(source: SourceFile) {
        source.getNamespaces().forEach(n => {
            n.getClasses().forEach(checkClass);
            n.getFunctions().forEach(executeJsDocs);
        })
        source.getClasses().forEach(checkClass);
        source.getFunctions().forEach(executeJsDocs);
    }

    const project = new Project({
        tsConfigFilePath: path.join(projectPath, 'tsconfig.json')
    });
    const sourceFiles = project.getSourceFiles().filter(s => !s.isDeclarationFile())
    sourceFiles.forEach(check);
    console.log(222)
    project.saveSync();

}

const projectPath = '../egret/packages/eui'

run(projectPath);