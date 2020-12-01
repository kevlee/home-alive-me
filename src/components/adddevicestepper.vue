<template>

    <md-dialog ref="diagcontent" class="md-scrollbar md-content diagcontent" :md-active.sync="showaddstepper" md-dialog-content :md-click-outside-to-close="false" @md-clicked-outside="close()">
        <md-content class="scroller md-scrollbar">
            <md-dialog-content class="steppercontainer">
                <md-steppers class="adddevicestepper md-alternative" :md-active-step.sync="currentstep" md-linear>
                    <md-step id="first" md-label="Choose Module Type" :md-done.sync="first" :md-editable="false">
                        <devicetypeselector @type="settype" />
                        <div class="processbuttton">
                            <md-button class="md-raised md-primary"
                                       @click.native="setDone('first', 'second');searchdevice()"
                                       :disabled.native="!devicetype">
                                Next
                            </md-button>
                        </div>
                    </md-step>
                    <md-step id="second" md-label="Waiting Getway Response" :md-done.sync="second" :md-editable="false">
                        <div id="progress"><md-progress-spinner v-if="spinner" md-mode="indeterminate"></md-progress-spinner></div>
                    </md-step>
                    <md-step id="third" md-label="Configure Device" :md-editable="false">
                        <configeditor v-bind:configs="configs" v-bind:dataset="newconfig"></configeditor>
                        <div class="processbuttton">
                            <md-button class="md-raised md-primary"
                                       @click="savenodeconfig();close()">
                                SAVE
                            </md-button>
                        </div>
                    </md-step>
                </md-steppers>
            </md-dialog-content>
        </md-content>
    </md-dialog>
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
            currentstep: 'first',
            first: false,
            second: false,
            Third: false,
            newconfig: { 'update': true },
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