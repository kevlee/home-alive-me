<template>

    <v-dialog class="diagcontent" scrollable v-model="dialog">

        <template v-slot:activator="{ on, attrs }">
            <v-list-item @click=""
                         v-bind="attrs"
                         v-on="on">
                <v-list-item-icon>
                    <v-icon>fas fa-plus</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title class="v-list-item-text">Add Device</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </template>

        <v-main class="scroller steppercontainer">
                <v-stepper class="adddevicestepper" v-model="currentstep">
                    <v-stepper-header>
                        <v-stepper-step id="first"
                                        :complete="currentstep > 1"
                                        step="1" />
                        <v-divider />
                        <v-stepper-step id="second"
                                        :complete="currentstep > 2"
                                        step="2" />
                        <v-divider />
                        <v-stepper-step id="third"
                                        :complete="currentstep > 3"
                                        step="3" />
                    </v-stepper-header>
                    <v-stepper-items>
                        <v-stepper-content step="1">
                            <devicetypeselector @type="settype" />
                            <div class="processbuttton">
                                <v-btn @click.native="currentstep = currentstep + 1 ;searchdevice()"
                                       :disabled="!devicetype">
                                    Next
                                </v-btn>
                            </div>
                        </v-stepper-content>
                        <v-stepper-content step="2">
                            <div id="progress"><v-progress-circular v-if="spinner" color="primary" indeterminate></v-progress-circular></div>
                        </v-stepper-content>
                        <v-stepper-content step="3">
                            <configeditor v-bind:configs="configs" v-bind:dataset="newconfig"></configeditor>
                            <div class="processbuttton">
                                <v-btn class="md-raised md-primary"
                                       @click="savenodeconfig();close()">
                                    SAVE
                                </v-btn>
                            </div>
                        </v-stepper-content>
                    </v-stepper-items>
                </v-stepper>
            </v-main>
    </v-dialog>
</template>

<script>
    import * as tools from '../../lib/tools.js'
    import configeditor from "./configeditor.vue";
    import devicetypeselector from "./devicetypeselector.vue";

    function initialState() {
        return {
            spinner: false,
            devicetype: null,
            node_uid: null,
            configs: null,
            currentstep: 1,
            first: false,
            second: false,
            Third: false,
            newconfig: { 'update': true },
            dialog: false,
        }
    }

    export default {
        name: 'adddevicestepper',
        data: () => (initialState()),
        props: [
            'showaddstepper'
        ],
        methods: {
            async searchdevice(controler_type = "zwave") {
                this.spinner = true
                const taskid = await tools.searchdevice(controler_type, this.devicetype)
                this.node_uid = await tools.fetchsynctask(taskid)
                if (!this.node_uid) {
                    this.close()
                    this.$emit('nodevice', 'no device find')
                    
                }
                this.configs = await tools.fetchconfig(this.node_uid)
                for (var config in this.configs) {
                    var label = this.configs[config].label
                    if (this.configs[config].value == 'Enable') {
                        this.newconfig[label]= true
                    } else {
                        this.newconfig[label] = false
                    }
                }

                this.spinner = false
                this.setDone('second', 'third')
                return;
            },
            settype(value) {
                this.devicetype = value
            },
            setDone(currentstep, nextstep) {
                this[currentstep] = true

                this.secondStepError = null

                if (nextstep) {
                    this.currentstep = nextstep
                }
            },
            setError() {
                this.secondStepError = 'This is an error!'
            },
            async savenodeconfig() {
                await tools.sendconfig(this.configs, this.node_uid)
            },
            close() {
                this.$emit('saved')
                Object.assign(this.$data, initialState());
            }

        },
        components: {
            devicetypeselector,
            configeditor,
        }
    }
</script>

<style scoped>

    .adddevicestepper {
        height: 100%;
        width: 100%;
    }

    .processbuttton {
        display: flex;
        flex-flow: row-reverse;
    }

    #progress {
        display: flex;
        justify-content: center;
        height:100%;
    }
    .steppercontainer{
        min-width:800px;
        max-width:100%;
    }
    .scroller {
        overflow: auto;
        width: 100%;
    }
    .diagcontent {
        overflow: auto;
        z-index: 1200;
    }


</style>