module.exports = {
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = 'KOSPI 200'
        return args
      })
  },
  outputDir: 'docs',
  filenameHashing: false,
  productionSourceMap: false,
  transpileDependencies: [
    'squarify'
  ]
}
