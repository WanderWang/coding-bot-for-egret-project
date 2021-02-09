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
        source.getClasses().forEach(checkClass);
        source.getFunctions().forEach(executeJsDocs);
    }

    const project = new Project({
        tsConfigFilePath: path.join(projectPath, 'tsconfig.json')
    });
    const sourceFiles = project.getSourceFiles();
    sourceFiles.forEach(check);

    project.saveSync();

}

const projectPath = '../egret/packages/tween'

run(projectPath);