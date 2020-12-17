<template>
    <md-dialog-content class="nodedetails">
        <md-tabs>
            <md-tab id="tab-manage" md-label="manage" v-if="nodeinfo.type == 'shutter'">
                <md-content>
                    <label for="curtainposition">Curtain Position</label>
                    <v-slider thumb-label ticks id="curtainposition" name="curtainposition"
                              min="0" max="100" v-model="lvl" step="25" 
                              @end="changelvl($number)" />
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
            lvl: 0,
            matchinglvl: {
                0: 0xFF,
                25: 0x54,
                50: 0x45,
                75: 0x20,
                100:0x00
            },
            delay : null,
        }
    }
    export default {
        name: 'listnodeinfo',
        data: () => (initialState()),
        props: [
            'nodeinfo',
            'configs',
            'curtainlvl'
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
            },
            curtainlvl: function (curtainlvl) {
                this.lvl = this.getcurtainlvl(curtainlvl.value)
            },
        },
        methods: {
            setcurtain(value) {
                //console.log(value)
            },
            getcurtainlvl(value) {
                var lvl
                switch (true) {
                    case value > this.matchinglvl[25]:
                        lvl = 0
                        break
                    case value > this.matchinglvl[50]:
                        lvl = 25
                        break
                    case value > this.matchinglvl[75]:
                        lvl = 50
                        break
                    case value > this.matchinglvl[100]:
                        lvl = 75
                        break
                    default:
                        lvl = 100
                }
                return lvl
            },
            changelvl(value) {
                console.log(value)
                this.lvl = value
                this.curtainlvl.value = this.matchinglvl[value]
                if (!this.delay) {
                    this.delay = setTimeout(() => {
                        tools.senddata(this.curtainlvl, this.nodeinfo.nodeuid)
                    }, 2000)
                } else {
                    clearTimeout(this.delay)
                    this.delay = setTimeout(() => {
                        tools.senddata(this.curtainlvl, this.nodeinfo.nodeuid)
                    }, 2000)
                }
                
            },
            async savenodeconfig() {
                await tools.sendconfig(this.configs, this.nodeinfo.nodeuid)
                this.$emit('newconfig', this.nodeinfo.nodeuid)
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