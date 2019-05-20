import path from 'path';
import fs from 'fs';

export function buildChunkMap(compilation) {
  const publicPath = compilation.mainTemplate.getPublicPath({
    hash: compilation.hash,
  });

  const chunkMap = new Map();
  for (const chunk of compilation.chunks) {
    for (const file of chunk.files) {
      chunkMap.set(
        `${publicPath}${chunk.name}${path.extname(file)}`,
        `${publicPath}${file}`
      );
    }
  }

  return chunkMap;
}

export function replaceSource(file, chunkMap, replaceResourcePath) {
  let source = fs.readFileSync(file, 'utf8');

  for (const key of chunkMap.keys()) {
    if(replaceResourcePath) {
      let regexp1 = new RegExp('(src|href)=".+' + key + '."', 'gi');
      let regexp2 = new RegExp('/.+' + key, 'gi');
      let srcPath = regexp2.exec(regexp1.exec(source));

      if(srcPath) {
        source = source.replace(new RegExp(srcPath, 'gi'), replaceResourcePath + chunkMap.get(key));
      }
    } else {
      source = source.replace(new RegExp(key, 'gm'), chunkMap.get(key));
    }
  }

  return source;
}
