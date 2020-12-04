<template>
    <md-dialog-content class="nodedetails">
        <md-tabs>
            <md-tab id="tab-manage" md-label="manage" v-if="nodeinfo.type == 'shutter'">
                <md-content>
                    <label for="curtainposition">Curtain Position</label>
                    <input type="range" id="curtainposition" name="curtainposition"
                           min="0" max="100" value="0" step="25" @change="lvl = $event.target.value">
                    <output id="value">{{lvl}}%</output>

                </md-content>
            </md-tab>
            <md-tab id="tab-home" md-label="Config" v-if="configs[0]">
                <configeditor v-bind:configs="configs" v-bind:dataset="newconfig"></configeditor>
                <div class="processbuttton">
                    <md-button class="md-raised md-primary save"
                               @click="savenodeconfig()">
                        SAVE
                    </md-button>
                </div>
            </md-tab>
        </md-tabs>
    </md-dialog-content>
</template>

<script>
    import * as tools from '../../lib/tools.js'
    import configeditor from "./configeditor.vue";

    function initialState() {
        return {
            newconfig: { 'update': true },
            lvl: "0",
        }
    }
    export default {
        name: 'listnodeinfo',
        data: () => (initialState()),
        props: [
            'nodeinfo',
            'configs',
        ],
        watch: {
            configs: function (configs) {
                for (var config in configs) {
                    var label = configs[config].label
                    if (configs[config].value == 'Enable') {
                        this.newconfig[label] = true
                    } else {
                        this.newconfig[label] = false
                    }
                }
            }
        },
        methods: {
            setcurtain(value) {
                console.log(value)
            },
            async savenodeconfig() {
                await tools.sendconfig(this.configs, this.node_uid)
                this.$emit('newconfig', this.node_uid)
            },
        },
        components: {
            configeditor,
        },
    }

</script>

<style scoped>
    .nodedetails {
        width: 100%;
    }
    .md-content {
        display: flex;
        justify-content: space-around;
    }

    #curtainposition {
        display: flex;
        min-width: 80%;
    }
    output#value {
        align-self: center;
    }

</style>