const fixLocalAsset = assets => (
  (Array.isArray(assets) ? assets : [assets]).map(asset => `/${asset}`)
)

const normalizeAssets = assets => {
  let normalized = []

  assets.forEach(item => {
    if (Array.isArray(item)) {
      item.forEach(asset => {
        normalized.push(asset)
      })
    } else {
      normalized.push(item)
    }
  })

  return normalized
}

export const getAssets = (config, localAssets = []) => (
  Array.concat(
    config.helmet.helmetProps.script.map(item => item.src),
    config.helmet.helmetProps.link.map(item => item.href),
    normalizeAssets(localAssets.map(asset => fixLocalAsset(asset)))
  )
)

export const getAssetsByExtension = (extension, localAssets = []) => (
  getAssets(localAssets).filter(asset => new RegExp('.(' + extension + ')$').test(asset))
)

export const getScripts = (localAssets = []) => (
  getAssetsByExtension('js', localAssets)
)

export const getStyles = (localAssets = []) => (
  getAssetsByExtension('css', localAssets)
)
