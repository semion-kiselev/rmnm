const test = require('node:test');
const assert = require('node:assert/strict');
const { mkdirSync, rmSync, writeFileSync, readdirSync, statSync } = require('fs');
const { resolve } = require('path');
const removeNodeModulesDirs = require('./remove-node-modules-dirs');

const createTestDirs = () => {
/*
  * test
  *   one
  *     node_modules
  *       index.js
  *     one_a
  *       node_modules
  *         index.js
  *       one_c
  *     one_b
  *       one_d
  *         node_modules
  *           index.js
  *         one_e
  *           3.txt
  *        2.txt
  *     1.txt
  *   two
  *     4.txt
*/

  mkdirSync(resolve(__dirname, './test/one/node_modules'), { recursive: true });
  mkdirSync(resolve(__dirname, './test/one/one_a/node_modules'), { recursive: true });
  mkdirSync(resolve(__dirname, './test/one/one_a/one_c'), { recursive: true });
  mkdirSync(resolve(__dirname, './test/one/one_b/one_d/node_modules'), { recursive: true });
  mkdirSync(resolve(__dirname, './test/one/one_b/one_d/one_e'), { recursive: true });
  mkdirSync(resolve(__dirname, './test/two'), { recursive: true });

  writeFileSync(resolve(__dirname, './test/one/1.txt'), '1');
  writeFileSync(resolve(__dirname, './test/one/node_modules/index.js'), 'const a = 1;');
  writeFileSync(resolve(__dirname, './test/one/one_a/node_modules/index.js'), 'const b = 2;');
  writeFileSync(resolve(__dirname, './test/one/one_b/2.txt'), '2');
  writeFileSync(resolve(__dirname, './test/one/one_b/one_d/node_modules/index.js'), 'const c = 3;');
  writeFileSync(resolve(__dirname, './test/one/one_b/one_d/one_e/3.txt'), '3');
  writeFileSync(resolve(__dirname, './test/two/4.txt'), '4');
}

const removeTestDirs = () => {
  rmSync(resolve(__dirname, './test'), { force: true, recursive: true });
};
test('it should remove node_modules recursively', (t) => {
  createTestDirs();

  const firstNodeModulesPlace = resolve(__dirname, './test/one');
  const secondNodeModulesPlace = resolve(__dirname, './test/one/one_a');
  const thirdNodeModulesPlace = resolve(__dirname, './test/one/one_b/one_d');

  const result1 = readdirSync(firstNodeModulesPlace);
  const result2 = readdirSync(secondNodeModulesPlace);
  const result3 = readdirSync(thirdNodeModulesPlace);

  assert.equal(result1.includes('node_modules'), true);
  assert.equal(result2.includes('node_modules'), true);
  assert.equal(result3.includes('node_modules'), true);

  removeNodeModulesDirs(resolve(__dirname, 'test'));

  const result4 = readdirSync(firstNodeModulesPlace);
  const result5 = readdirSync(secondNodeModulesPlace);
  const result6 = readdirSync(thirdNodeModulesPlace);

  assert.equal(result4.includes('node_modules'), false);
  assert.equal(result5.includes('node_modules'), false);
  assert.equal(result6.includes('node_modules'), false);

  removeTestDirs();
});
