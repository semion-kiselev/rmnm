const { rmSync, readdirSync, statSync } = require('fs');
const { resolve } = require('path');

const removeNodeModulesDirs = (p) => {
  const dirPath = p || process.cwd();

  const remove = (path) => {
    const result = readdirSync(path);
    result.forEach((entity) => {
      if (entity === 'node_modules') {
        rmSync(resolve(path, 'node_modules'), { force: true, recursive: true });
        return;
      }
      const entityStat = statSync(resolve(path, entity));
      if (entityStat.isDirectory()) {
        remove(resolve(path, entity));
      }
    });
  };

  remove(dirPath);

  console.log('node_modules were successfully removed');
};

module.exports = removeNodeModulesDirs;
