<template>
    <v-dialog content-class="dialog"
              v-model="showaddmodule"
              @click:outside="close()">
        <v-card class="diagcontent">
            <v-card-title>
                <span class="headline">Add Module</span>
            </v-card-title>
            <v-container class="moduleconfig">
                <v-row>
                    <v-col class="d-flex" md="6">
                        <v-combobox :items="items"
                                    label="Module type"
                                    v-model="moduletype"
                                    outlined
                                    required>
                        </v-combobox>
                    </v-col>
                    <v-col class="d-flex" md="6">
                        <v-combobox v-if="moduletype"
                                    :items="portlist"
                                    label="Select port"
                                    v-model="port"
                                    outlined
                                    required>
                        </v-combobox>
                    </v-col>
                </v-row>
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
            items: ["zwave"]
        }
    }

    export default {
        name: 'addmodules',
        data: () => (initialState()),
        props: [
            'showaddmodule'
        ],
        watch: {
            showaddmodule: function (showaddmodule) {
                if (showaddmodule) {
                    this.getmodule()
                }
            },
        },
        methods: {
            async getmodule() {
                this.availablemodule = await tools.getallmodules()
                this.portlist = await tools.getallports()
            },
            close() {
                Object.assign(this.$data, initialState());
                this.$emit('closed')
            },
        }
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