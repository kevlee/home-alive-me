<template>
    <v-container fluid>
        <v-row v-for="(config,index) in configs">
            <v-content>
                <v-switch class="config" :name="config.label"
                          v-if="isswtichonoff(config)"
                          v-model="dataset[config.label]"
                          @change="loadnewconf(index)"
                          :label="config.label"
                          >
                </v-switch>
            </v-content>
    </v-row>
    <v-switch class="update" v-model="dataset['update']"></v-switch>
    </v-container>
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
    .config{
        margin-left:20px;
    }
</style>