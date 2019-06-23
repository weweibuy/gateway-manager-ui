import request from '@/utils/request'


export function addPredicate(data) {
  return request({
    url: '/gateway/predicate',
    method: 'post',
    data: data
  })
}
