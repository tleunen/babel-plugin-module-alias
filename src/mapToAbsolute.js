import path from 'path';

import { toPosixPath } from './utils';

export default function mapToAbsolute(currentFile, relativePath) {
  const currentDirectory = path.dirname(currentFile);
  const absolutePath = path.resolve(currentDirectory, relativePath);
  
  return toPosixPath(absolutePath);
}
