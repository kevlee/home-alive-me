<template>
    <v-container fluid>
        <v-row v-for="(config,index) in configs">
            <v-main>
                <v-switch class="config" :name="config.label"
                          v-if="isswtichonoff(config)"
                          v-model="config.availablevalue[config.value]"
                          @change="loadnewconf(index)"
                          :label="config.label"
                          :value="config.availablevalue[1]">
                </v-switch>
                <v-combobox class="config" :name="config.label"
                          v-model="config.value"
                          :items="config.availablevalue.choices"
                          v-if="ischoice(config)"
                          :rules="getrules(config)"
                          @update:modelValue=""
                          :label="config.label">

                </v-combobox>
                <v-text-field class="config" :name="config.label"
                          v-model="config.value"
                          v-if="!isswtichonoff(config) && !ischoice(config)"
                          :type="gettype(config)"
                          :rules="getrules(config)"
                          @update:modelValue=""
                          :label="config.label">
                </v-text-field>
            </v-main>
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
            ischoice(config) {
                return config.availablevalue.hasOwnProperty("choices")
            },
            loadnewconf(index) {
                if (this.configs[index].availablevalue[this.configs[index].value] == this.configs[index].availablevalue[0]) {
                    this.configs[index].value = 1
                } else {
                    this.configs[index].value = 0
                }
                this.dataset.update = !this.dataset.update
            },
            gettype(config) {
                if (config.typevalue == "string") {
                    return "text"
                }
                if (config.typevalue == "number") {
                    return "number"
                }
            },
            getrules(config) {
                let rules = []
                rules.push(value => !!value || 'Required.')
                if (config.availablevalue.hasOwnProperty("choices")) {
                    rules.push(value => config.availablevalue.choices.includes(value)
                        || "value must be " + JSON.stringify(config.availablevalue.choices))
                }
                if (config.availablevalue.hasOwnProperty("min") && config.availablevalue.hasOwnProperty("max")) {
                    rules.push(value => (value >= config.availablevalue.min && value <= config.availablevalue.max)
                        || "value must be between " + config.availablevalue.min + " and " +
                    config.availablevalue.max)
                }
                return rules
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