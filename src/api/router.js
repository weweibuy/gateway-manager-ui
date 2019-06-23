import request from '@/utils/request'

export function getRouters(data) {
  return request({
    url: '/gateway/router',
    method: 'get',
    params: data
  })
}

export function addRouter(data) {
  return request({
    url: '/gateway/router',
    method: 'post',
    data: data
  })
}
