import { SourceFile, ts } from "ts-morph";



export function removeNamespaceCall(items: { namespace: string, object: string }[]) {

    return (source: SourceFile) => {

        source.transform((traversal) => {

            const node = traversal.visitChildren();
            if (ts.isPropertyAccessExpression(node)) {
                const expression = node.expression;
                if (ts.isIdentifier(expression)) {
                    for (let item of items) {
                        if (expression.getText() === item.namespace && node.name.getText() === item.object) {
                            return node.name;
                        }
                    }
                }
            }

            if (ts.isTypeReferenceNode(node)) {
                const typeName = node.typeName;
                if (ts.isQualifiedName(typeName)) {
                    for (const item of items) {
                        if (typeName.left.getText() === item.namespace && typeName.right.getText() === item.object) {
                            const factory = ts.factory;
                            return factory.createTypeReferenceNode(
                                typeName.right,
                                undefined
                            )
                        }
                    }
                }
            }
            return node;
        })
    }

}
