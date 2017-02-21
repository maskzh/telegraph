/**
 * 生成随机 ID
 * @param {number} len ID 长度
 * @param {string} prefix ID 前缀
 * @param {string} keyspace ID 字符集
 * @return {string}
 */

export default function genId(len, prefix, keyspace) {
  if (len == null) len = 32
  if (prefix == null) prefix = ''
  if (keyspace == null) keyspace = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  while (len-- > 0) {
    prefix += keyspace.charAt(Math.floor(Math.random() * keyspace.length))
  }
  return prefix
}
