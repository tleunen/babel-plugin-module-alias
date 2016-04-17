const path = require('path');

function createFilesMap(state) {
    const result = {};
    let opts = state.opts;
    if(!Array.isArray(opts)) {
        opts = [opts];
    }

    opts.forEach(moduleMapData => {
        result[moduleMapData.expose] = moduleMapData.src;
    });

    return result;
}

function resolve(filename) {
    if(path.isAbsolute(filename)) return filename;
    return path.resolve(process.cwd(), filename);
}

export function mapToRelative(currentFile, module) {
    let from = path.dirname(currentFile);
    let to = path.normalize(module);

    from = resolve(from);
    to = resolve(to);

    let moduleMapped = path.relative(from, to);

    // Support npm modules instead of directories
    if(moduleMapped.indexOf('npm:') !== -1) {
        const [, npmModuleName] = moduleMapped.split('npm:');
        return npmModuleName;
    }

    if(moduleMapped[0] !== '.') moduleMapped = `./${moduleMapped}`;
	
	var sepExp = new RegExp('\\\\', 'g');

    return moduleMapped.replace(sepExp, '/');
}

function mapModule(modulePath, state, filesMap) {
    const moduleSplit = modulePath.split('/');

    let src;
    while(moduleSplit.length) {
        const m = moduleSplit.join('/');
        if(filesMap.hasOwnProperty(m)) {
            src = filesMap[m];
            break;
        }
        moduleSplit.pop();
    }

    if(!moduleSplit.length) {
        return null;
    }

    const newPath = modulePath.replace(moduleSplit.join('/'), src);
    return mapToRelative(state.file.opts.filename, newPath);
}


export default ({ types: t }) => {
    function transformRequireCall(nodePath, state, filesMap) {
        if(
            !t.isIdentifier(nodePath.node.callee, { name: 'require' }) &&
                !(
                    t.isMemberExpression(nodePath.node.callee) &&
                    t.isIdentifier(nodePath.node.callee.object, { name: 'require' })
                )
        ) {
            return;
        }

        const moduleArg = nodePath.node.arguments[0];
        if(moduleArg && moduleArg.type === 'StringLiteral') {
            const modulePath = mapModule(moduleArg.value, state, filesMap);
            if(modulePath) {
                nodePath.replaceWith(t.callExpression(
                    nodePath.node.callee, [t.stringLiteral(modulePath)]
                ));
            }
        } else if (moduleArg && moduleArg.type === 'BinaryExpression' &&  moduleArg.left.type === 'StringLiteral') {
		    const modulePath = mapModule(moduleArg.left.value, state, filesMap);
		    if (modulePath) {
			    moduleArg.left = t.stringLiteral(modulePath);
			    nodePath.replaceWith(t.callExpression(nodePath.node.callee, [moduleArg]));
		    }
	    } else if (moduleArg && moduleArg.type === 'TemplateLiteral' && moduleArg.quasis.length) {
		    const modulePath = mapModule(moduleArg.quasis[0].value.raw, state, filesMap);
		    if (modulePath) {
			    moduleArg.quasis[0].value = {
				    raw: modulePath,
				    cooked: modulePath
			    };
			    nodePath.replaceWith(t.callExpression(nodePath.node.callee, [moduleArg]));
		    }
	    }
    }

    function transformImportCall(nodePath, state, filesMap) {
        const moduleArg = nodePath.node.source;
        if(moduleArg && moduleArg.type === 'StringLiteral') {
            const modulePath = mapModule(moduleArg.value, state, filesMap);
            if(modulePath) {
                nodePath.replaceWith(t.importDeclaration(
                    nodePath.node.specifiers,
                    t.stringLiteral(modulePath)
                ));
            }
        }
    }

    return {
        visitor: {
            CallExpression: {
                exit(nodePath, state) {
                    return transformRequireCall(nodePath, state, createFilesMap(state));
                }
            },
            ImportDeclaration: {
                exit(nodePath, state) {
                    return transformImportCall(nodePath, state, createFilesMap(state));
                }
            }
        }
    };
};
