<template>
    <v-dialog content-class="dialog"
              v-model="requireaddmodule"
              :persistent="ispersistant()"
              @click:outside="close()">
        <v-card class="diagcontent">
            <v-card-title>
                <span class="headline">Add Module</span>
            </v-card-title>
            <v-container class="moduleconfig">
                <v-form ref="form" name="form"
                        v-model="valid"
                        lazy-validation>
                <v-row>
                    <v-col class="d-flex" md="6">
                        <v-combobox :items="items"
                                    label="Module type"
                                    v-model="moduletype"
                                    :rules="[v => !!v || 'Item is required']"
                                    outlined
                                    required>
                        </v-combobox>
                    </v-col>
                    <v-col class="d-flex" md="6">
                        <v-combobox v-if="moduletype"
                                    :items="portlist"
                                    label="Select port"
                                    v-model="port"
                                    :rules="[v => !!v || 'Item is required']"
                                    outlined
                                    required>
                        </v-combobox>
                    </v-col>
                </v-row>
                <v-row justify="end">
                    <v-btn depressed
                           color="primary"
                           @click="validate()">
                        SAVE
                    </v-btn>
                </v-row>
                </v-form>
            </v-container>
        </v-card>
    </v-dialog>
</template>

<script>

    import * as tools from '../../lib/tools.js'

    function initialState() {
        return {
            availablemodule: null,
            portlist: [],
            moduletype: null,
            port: null,
            items: ["zwave","zigbee"],
            valid: false,
            requireaddmodule: false,
        }
    }

    export default {
        name: 'addmodules',
        data: () => (initialState()),
        props: [
            'showaddmodule',
        ],
        watch: {
            showaddmodule: function (showaddmodule) {
                if (showaddmodule) {
                    this.getport()
                    this.requireaddmodule = true
                }
            },
        },
        mounted:
            async function () {
                this.getport()
                await tools.getallmodules()
                this.requireaddmodule = Object.keys(tools.modules).length == 0 || this.showaddmodule
            },
        methods: {
            async getport() {
                this.portlist = await tools.getallports()
            },
            close() {
                if (!this.ispersistant()) { 
                    this.$emit('closed')
                    this.$refs.form.resetValidation()
                    Object.assign(this.$data, initialState());
                }
            },
            async validate() {
                if (this.$refs.form.validate()) {
                    await tools.setmodule(this.moduletype, this.port)
                    await tools.getallmodules()
                    this.close()
                }
                
            },
            ispersistant() {
                return Object.keys(tools.modules).length == 0
            }
        },
    }
</script>

<style scoped lang="scss">


    .dialog {
        width: 600px;
    }

    .diagcontent {
        overflow: auto;
    }

    .moduleconfig {
        min-width: 600px;
    }

    /*.diagcontent::-webkit-scrollbar {
        height: 10px;
    }

    .diagcontent::-webkit-scrollbar-track {
        background: #e6e6e6;
        border-left: 1px solid #dadada;
    }

    .diagcontent::-webkit-scrollbar-thumb {
        background: #757575;
        border: solid 1px #e6e6e6;
        border-radius: 10px;
    }*/


</style>