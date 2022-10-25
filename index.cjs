// CJS -> ESM proxy file
// Reference: https://github.com/vitejs/vite/blob/9f268dad2e82c0f1276b1098c0a28f1cf245aa50/packages/vite/index.cjs

// redirect async functions to ESM
const asyncFunctions = [
  'crawlFrameworkPkgs',
  'findDepPkgJsonPath',
  'findClosestPkgJsonPath'
]

for (const fn of asyncFunctions) {
  module.exports[fn] = function () {
    // @ts-expect-error trust me
    return import('./index.js').then((mod) => mod[fn].apply(this, arguments))
  }
}

// throw sync functions
const syncFunctions = ['pkgJsonNeedsOptimization']

for (const fn of syncFunctions) {
  module.exports[fn] = function () {
    throw new Error(
      `"${fn}" is not supported in CJS build of \`vite-framework-utils\`.\nPlease use ESM or dynamic imports \`const { ${name} } = await import('vite-framework-utils')\`.`
    )
  }
}
