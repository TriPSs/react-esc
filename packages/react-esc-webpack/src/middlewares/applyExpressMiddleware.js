// Based on: https://github.com/dayAlone/koa-webpack-hot-middleware/blob/master/index.js
export default (fn, req, res) => {
  const originalEnd = res.end

  return new Promise((resolve) => {
    res.end = () => {
      originalEnd.apply(this, arguments)
      resolve(false)
    }

    fn(req, res, () => {
      resolve(true)
    })
  })
}