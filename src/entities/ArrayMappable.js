import pluralize from 'pluralize'
import {camelCase } from '../utility/stringUtility'

export default class ArrayMappable {
    constructor(model) {
        this.bindKey = pluralize(camelCase(model.name))
        this.model = model
    }

    bind(key) {
        this.bindKey = key
        return this
    }


}
