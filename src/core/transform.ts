import { AxiosTransformer } from './../types/index'
export default function transform(
  data: any,
  headers: any,
  fns?: AxiosTransformer | AxiosTransformer[]
) {
  if (!fns) {
    return data
  }

  if (!Array.isArray(fns)) {
    fns = [fns]
  }

  // 遍历转换数组，依次执行转换函数，拿到最后transform的data
  fns.forEach(fn => {
    data = fn(data, headers)
  })

  return data
}
