<template>
    <md-dialog-content class="nodedetails">
        <md-tabs>
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
        }
    }
    export default {
        name: 'listnodeinfo',
        data: () => (initialState()),
        props: [
            'nodeuid',
            'configs'
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
</style>