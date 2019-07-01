import linq from 'linq'

function valid(event) {
    const files = event.target.files || event.dataTransfer.files
    if (!files.length) {
        throw new Error('ファイルが見つかりません')
    }
    return files
}

/**
 *
 * @param event
 * @param bind: Function
 */
export function setThumbnail(event, bind = () => {}) {

    const files = valid(event)

    const file = files[0]

    bindResult(file, bind)

}

export function bindResult(file, bind = () => {}, type = 'url') {
    const reader = new FileReader()
    reader.onload = (event) => {
        bind(event.target.result)
    }
    if (type === 'url') {
        reader.readAsDataURL(file)
    }

    if (type === 'array') {
        reader.readAsArrayBuffer(file)
    }
}

export function setImageOrVideoThumbnail(event, bind = () => {}) {
    let file
    if (event.constructor.name !== 'File') {
        file = getFile(event).first()
    } else {
        file = event
    }

    if (file.type.match(/video/)) {
        bind(URL.createObjectURL(file))
        return
    }

    bindResult(file, bind)
}

/**
 *
 * @param event
 * @returns {Enumerable.IEnumerable<any>}
 */
export function getFile(event) {

    const files = valid(event)

    return linq.from(files)
}

