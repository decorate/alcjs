<template>
  <div>
    <h1>Example!</h1>
  </div>
</template>

<script>
import axios from "axios";
import Model from "../Model";

export default {
  name: "example",

  data() {
    return {};
  },

  async created() {
    const m = new User({ id: 1, name: "ok", user_detail: "goo" });
    console.log(m, m.isDirty(), m.isDirtyStrict());
  },

  methods: {},
};

class User extends Model {
  constructor(data) {
    super();

    this.fillable = ["name", "password", "userDetail"];
    this.presents = ["password"];

    //this.convert = false

    this.id = 0;
    this.name = "";
    this.password = null;
    this.userDetail = "";

    this.data = data;
  }
}
</script>
