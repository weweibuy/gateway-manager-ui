import request from '@/utils/request'


export function addPredicateArgs(data) {
  return request({
    url: '/gateway/predicate/args',
    method: 'post',
    data: data
  })
}
