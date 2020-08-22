# tools
编译相关的配置和工具

# 打包相关的要求
## 通用
1. js/jsx使用babel-loader处理，配合preset-env和react
1. 样式使用less和css，因此使用
    1. less-loader预处理
    1. postcss-loader加上前缀等
    1. css-loader分模块
    1. style-loader加入到页面的style tag
1. `todo` react，ant-design，以及其他vendor需要单独的chunk，runtime有单独的chunk
1. `todo` css需要分离出来，对于非src下的css，不做css-loader处理
1. hmr需要更细粒度
1. 非js和css的文件，打上hash标记之后复制到dist
1. ant-design主题支持

## 开发
1. HMR
1. cache
1. inline-cheap-module-source-map

## 生产
1. js需要压缩，uglify等
1. css需要css-nano处理，并且分离出去
1. hidden-source-map
