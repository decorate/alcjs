import linq from "linq";
import { snakeToCamel, camelToSnake, camelCase } from "./utility/stringUtility";
import Form from "vform";
import { arrayWrap } from "./utility/arrayUtitlity";

class Model {
  constructor() {
    this.form = new Form();
    this._fillable = [];
    this._presents = [];
    this._convert = true;

    this.converter = {
      snakeToCamel: snakeToCamel,
      camelToSnake: camelToSnake,
    };

    this.arrayMapTarget = [];
  }

  get hasError() {
    return Object.keys(this.form.errors.errors).length;
  }

  get errors() {
    return linq
      .from(this.form.errors.errors)
      .select((x) => {
        return arrayWrap(x.value)[0];
      })
      .toArray();
  }

  get busy() {
    return this.form.busy;
  }

  get data() {
    return this.originalData;
  }

  set data(val) {
    this.originalData = val;

    if (val) {
      this.create();
    }
  }

  get fillable() {
    return this._fillable;
  }

  set fillable(val) {
    this._fillable = val;
  }

  get presents() {
    return this._presents;
  }

  set presents(val) {
    this._presents = val;
  }

  get convert() {
    return this._convert;
  }

  set convert(val) {
    this._convert = val;

    if (!val) {
      this.converter = {
        snakeToCamel: (p) => p,
        camelToSnake: (p) => p,
      };
    }
  }

  update(data) {
    this.data = data;
    return this;
  }

  fill() {
    this.form = new Form(this.getPostable());
  }

  create() {
    linq
      .from(this.data)
      .select((x) => {
        x.key = this.converter.camelToSnake(x.key);
        return x;
      })
      .where((x) => this.hasOwnProperty(this.converter.snakeToCamel(x.key)))
      .select((x) => {
        const key = this.converter.snakeToCamel(x.key);

        if (this[key] instanceof Number) {
          x.value = Number(x.value);
        }

        if (this[key] && this[key].getPostable instanceof Function) {
          x.value = new this[key].constructor(x.value);
        }

        this[key] = x.value;
        return x;
      })
      .toArray();

    this.setRelations();
  }

  setRelations() {
    linq
      .from(this.arrayMapTarget)
      .where((x) => this.hasOwnProperty(x.bindKey))
      .select((x) => {
        return {
          originKey: x.bindKey,
          key: this.converter.camelToSnake(x.bindKey),
          value: x.model,
        };
      })
      .select((x) => {
        return (this[x.originKey] = linq
          .from(this.data[x.key])
          .select((xs) => new x.value(xs))
          .toArray());
      })
      .toArray();
  }

  arrayMap(...mappable) {
    this.arrayMapTarget = mappable;
  }

  joinWhere(x) {
    return linq.from(this.presents).any((xs) => x.key === xs);
  }

  beforePostable() {}

  afterPostable(res) {}

  getPostable() {
    this.beforePostable();

    const res = linq
      .from(this)
      .where((x) => linq.from(this.fillable).any((xs) => xs === x.key))
      .where((x) => x.value || this.joinWhere(x))
      .select((x) => {
        const key = this.converter.camelToSnake(x.key);

        if (x.value && x.value.getPostable instanceof Function) {
          x.value = x.value.getPostable();
        }

        if (x.value instanceof Array && x.value[0]) {
          if (x.value[0].getPostable instanceof Function) {
            x.value = linq
              .from(x.value)
              .select((x) => x.getPostable())
              .toArray();
          }
        }

        return {
          key: key,
          value: x.value,
        };
      })
      .toObject("$.key", "$.value");

    this.afterPostable(res);

    return res;
  }

  async post(url) {
    this.fill();
    return await this.form.post(url);
  }

  async delete(url) {
    this.fill();
    return await this.form.delete(url);
  }

  async patch(url) {
    this.fill();
    return await this.form.patch(url);
  }

  isDirty() {
    const originalData = {};
    Object.keys(this.data).forEach((key) => {
      originalData[this.converter.snakeToCamel(key)] = this.data[key];
    });

    return this._fillable.some((x) => this[x] != originalData[x]);
  }

  isDirtyStrict() {
    const originalData = {};
    Object.keys(this.data).forEach((key) => {
      originalData[this.converter.snakeToCamel(key)] = this.data[key];
    });

    return this._fillable.some((x) => this[x] !== originalData[x]);
  }
}

export default Model;
