"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildChunkMap = buildChunkMap;
exports.replaceSource = replaceSource;

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function buildChunkMap(compilation) {
  const publicPath = compilation.mainTemplate.getPublicPath({
    hash: compilation.hash
  });
  const chunkMap = new Map();

  for (const chunk of compilation.chunks) {
    for (const file of chunk.files) {
      chunkMap.set(`${publicPath}${chunk.name}${_path.default.extname(file)}`, `${publicPath}${file}`);
    }
  }

  return chunkMap;
}

function replaceSource(file, chunkMap, replaceResourcePath) {
  let source = _fs.default.readFileSync(file, 'utf8');

  for (const key of chunkMap.keys()) {
    if (replaceResourcePath) {
      let regexp1 = new RegExp('(src|href)=".+/' + key + '."', 'gi');
      let regexp2 = new RegExp('/.+' + key, 'gi');
      let srcPath = regexp2.exec(regexp1.exec(source));

      if (srcPath) {
        let srcPathArr = srcPath[0].split('/');
        let lastIndex = srcPathArr.length - 1;

        source = source.replace(srcPath[0], replaceResourcePath + chunkMap.get(key));
      }
    } else {
      source = source.replace(new RegExp(key, 'gm'), chunkMap.get(key));
    }
  }

  return source;
}