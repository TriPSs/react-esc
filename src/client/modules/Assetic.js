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

export const getAssets = (layout, localAssets = []) => (
  Array.concat(
    layout.script.map(item => item.src),
    layout.link.map(item => item.href),
    normalizeAssets(localAssets.map(asset => fixLocalAsset(asset)))
  )
)

export const getAssetsByExtension = (layout, extension, localAssets = []) => (
  getAssets(layout,localAssets).filter(asset => new RegExp('.(' + extension + ')$').test(asset))
)

export const getScripts = (layout, localAssets = []) => (
  getAssetsByExtension(layout, 'js', localAssets)
)

export const getStyles = (layout, localAssets = []) => (
  getAssetsByExtension(layout, 'css', localAssets)
)
