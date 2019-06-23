import request from '@/utils/request'


export function addFilter(data) {
  return request({
    url: '/gateway/filter',
    method: 'post',
    data: data
  })
}
