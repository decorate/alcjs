<template>
    <div>
        <h1>Example!</h1>
    </div>
</template>

<script>
    import axios from 'axios'
    import Model from '../Model'

    export default {
        name: 'example',

        data() {
            return {}
        },

        async created() {
            const m = new User({name: 'ok'})
            console.log(m.getPostable())
        },

        methods: {
        }
    }

    class User extends Model {
        constructor(data) {
            super()

            this.fillable = ['id', 'name', 'password']
            this.presents = ['password']

            this.id = 0
            this.name = ''
            this.password = null

            this.data = data
        }
    }
</script>