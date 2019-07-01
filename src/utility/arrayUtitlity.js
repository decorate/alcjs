import linq from 'linq'

export function arrayWrap (value) {
    return Array.isArray(value) ? value : [value]
}

let arrayResponse = []
/**
 *条件にしたがって再帰的に配列を検索しターゲット含む配列を返却
 * @param src
 * @param target
 * @param condition
 * @param key
 * @returns {Enumerable.IEnumerable<any>}
 */
export function recursiveSameLevelArraySearch(
    src,
    target,
    condition = (data, target) => { return data.id === target.id },
    key = 'children'
) {
    linq.from(src)
        .select(x => {
            if (!condition(x, target) && x[key]) {
                recursiveSameLevelArraySearch(x[key], target, condition, key)
            }
            return x
        })
        .where(x => condition(x, target))
        .select(x => arrayResponse = src)
        .toArray()

    return arrayResponse
}

let response
export function recursiveSearch(
    src,
    target,
    condition = (data, target) => { return data.id === target.id },
    key = 'children'
) {
    linq.from(src)
        .select(x => {
            if (!condition(x, target) && x[key]) {
                recursiveSearch(x[key], target, condition, key)
            }
            return x
        })
        .where(x => condition(x, target))
        .select(x => response = x)
        .toArray()

    return response
}

export function search(src, target, condition = (data, target) => { return data.id === target.id }) {
    return linq.from(src)
        .select((x, i) => {
            return {data: x, index: i}
        })
        .where(x => condition(x.data, target))
        .firstOrDefault(null)
}

export function searchNext(src, target, condition = (data, target) => { return data.id === target.id }) {
    const d = search(src, target, condition)

    if (d) {
        return src[++d.index]
    }
}

export function searchPrev(src, target, condition = (data, target) => { return data.id === target.id }) {
    const d = search(src, target, condition)

    if (d) {
        return src[--d.index]
    }
}

/**
 * targetに対してsrc側の指定したkeyの値をマージする
 * @param target
 * @param src
 * @param key
 * @param childrenKey
 * @param condition
 */
export function searchKeyMergeRecursive(
    target,
    src,
    key,
    childrenKey = 'children',
    condition = (data) => { return data.hasChildren },
) {
    linq.from(target)
        .doAction(x => {
            if (condition(x)) {
                searchKeyMergeRecursive(x[childrenKey], src, key, childrenKey, condition)
            }
        })
        .select(x => {
            return {
                t: x,
                s: recursiveSearch(src, x)
            }
        })
        .where(x => x.s[key])
        .select(x => x.t[key] = x.s[key])
        .toArray()
}

