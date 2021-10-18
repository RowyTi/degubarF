<template>
<div>
<h1>usuarios</h1>
<base-data-table :headers='headers' />
</div>
  
</template>

<script>
import { deserialize } from 'jsonapi-fractal'
import BaseDataTable from '../../../../components/BaseDataTable.vue'
export default {
    name: "AdministracionUsuarios",
    components: { BaseDataTable },
    layout: "admin",
    middleware: "permission-user",
    data: () => ({
        headers: [
            {
                text: "nombre",
                value: "name"
            },
             {
                text: "email",
                value: "email"
            },
        ]
    }),
    head: {
        title: "Usuarios"
    },
    created(){
        this.getData();
    },
    methods: {
        async getData(){
            const response = await this.$axios.get('http://localhost:8000/v1/users/1?include=profile')
            const entity = deserialize(response.data, { changeCase: 'camelCase'})
            console.log(entity)
        }
    }
}
</script>

<style>

</style>