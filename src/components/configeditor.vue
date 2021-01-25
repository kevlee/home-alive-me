<template>
    <div>
        <md-content v-for="(config,index) in configs">
            <md-switch class="md-primary" :name="config.label"
                       v-if="isswtichonoff(config)"
                       v-model="dataset[config.label]"
                       @change="loadnewconf(index)">{{config.label}}</md-switch>
        </md-content>
        <md-switch class="update" v-model="dataset['update']"></md-switch>
    </div>
</template>

<script>
    export default {
        name: 'configeditor',
        props: [
            'configs',
            'dataset',
        ],
        methods: {
            isswtichonoff(config) {
                return JSON.stringify(Object.keys(config.availablevalue)) == JSON.stringify(["0", "1"])
            },
            loadnewconf(index) {
                if (this.configs[index].value == this.configs[index].availablevalue[0]) {
                    this.configs[index].value = this.configs[index].availablevalue[1]
                } else {
                    this.configs[index].value = this.configs[index].availablevalue[0]
                }
                this.dataset.update = !this.dataset.update
            },
        }
    }
</script>

<style scoped>
    .update{
        display:none;
    }
</style>