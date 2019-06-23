import request from '@/utils/request'

/**
 * 获取全部接入系统
 * @param data
 */
export function getAccessSystems() {
  return request({
    url: '/gateway/access-system',
    method: 'get',
  })
}

