import request from '@/utils/request'


export function getRouterPredicates() {
  return request({
    url: '/gateway/dict/predicates',
    method: 'get',
  })
}

export function getPredicateArgs() {
  return request({
    url: '/gateway/dict/predicate/args',
    method: 'get',
  })
}


export function getChildByPid(pid) {
  return request({
    url: '/gateway/dict/parent/' + pid,
    method: 'get',
  })
}


export function getRouterFilters() {
  return request({
    url: '/gateway/dict/filters',
    method: 'get',
  })
}
