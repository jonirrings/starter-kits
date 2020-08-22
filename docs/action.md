# action字段
采用[Flux Standard Action](https://github.com/redux-utilities/flux-standard-action)

1. type字段，必选，为string或者symbol类型
1. payload字段，可选，可为任何类型，推荐plain object内附其他字段。当error字段为true时，payload应为error示例。
1. error字段，可选，true以外的值，均不该认为出现错误。
1. meta字段，可选，可为任何类型，存放上述之外的元数据。

