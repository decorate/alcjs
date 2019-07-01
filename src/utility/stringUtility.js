import linq from 'linq'


export function snakeToCamel(p) {
    if (p === undefined || typeof (p.replace) !== 'function') return

    return p.replace(/_./g, (s) => {
        return s.charAt(1).toUpperCase()
    })
}

export function camelToSnake(p) {
    if (p === undefined || typeof (p.replace) !== 'function') return

    return p.replace(/([A-Z])/g,
        (s) => '_' + s.charAt(0).toLowerCase())
}

export function camelCase(str){
    str = str.charAt(0).toLowerCase() + str.slice(1);
    return str.replace(/[-_](.)/g, function(match, group1) {
        return group1.toUpperCase();
    });
}

export function pascalCase(str){
    const camel = camelCase(str);
    return camel.charAt(0).toUpperCase() + camel.slice(1);
}

export function toInt(str) {
    str = str
        .replace(/[０-９．]/g, function (s) {
            return String.fromCharCode(s.charCodeAt(0) - 65248);
        })
        .replace(/[‐－―ー]/g, '')
        .replace(/[^\-\d\.]/g, '')
        .replace(/(?!^\-)[^\d\.]/g, '');
    return parseInt(str, 10);
}

/**
 *
 * @param query
 * @returns {any}
 */
export function buildQuery(query) {
    if (!Object.keys(query).length) return ''
    return linq.from(query)
        .select(x => {
            return `${x.key}=${x.value}`
        })
        .aggregate((prev, current) => {
            return `${prev}&${current}`
        })
}