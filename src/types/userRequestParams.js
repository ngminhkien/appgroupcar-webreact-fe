/**
 * @typedef {import('@/types/requestParams').BaseListRequestParams} BaseListRequestParams
 */

/**
 * User list request params.
 * Inherits common paging/search params and adds createdAt.
 * @typedef {BaseListRequestParams & {
 *   createdAt?: string
 * }} UserListRequestParams
 */

export {};
