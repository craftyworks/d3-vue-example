module.exports = {
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = '몬드리안 연구소'
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
