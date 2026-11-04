/**
 * Extract the fields used by ZnAbout from an imported package.json object.
 * Browser applications should import their own package.json and pass it here.
 */
export function getAppMetadata(packageJson = {}) {
  const author = packageJson.author

  return {
    name: packageJson.name ?? '',
    version: packageJson.version ?? '',
    description: packageJson.description ?? '',
    author: typeof author === 'string' ? author : author?.name ?? ''
  }
}
