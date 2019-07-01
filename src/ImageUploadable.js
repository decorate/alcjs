
import * as fU from './utility/fileUtility'
import Model from './Model'

export default class ImageUploadable extends Model{

    constructor () {
        super()

        this.file = null
        this.blobImage = ''
        this.path = '/img/noimage.png'
    }

    get _model () {
        return 'ImageUploadable'
    }

    get imageView () {
        if (this.file) {
            fU.bindResult(this.file, (p) => this.blobImage = p)
            return this.blobImage
        }

        return this.path
    }

    get has () {
        return this.path !== '/img/noimage.png' || this.file
    }

    imageCreate (event) {
        this.file = fU.getFile(event).first()
    }

    beforePostable() {
        this.fillable = [...this.fillable, 'blobImage', 'path']
    }

}