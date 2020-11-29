<template>
    <md-content class="md-scrollbar">
        <md-steppers class="adddevicestepper">
            <md-step id="first" md-label="Choose Module Type">
                <devicetypeselector @type="settype" />
            </md-step>
            <md-step id="Second" md-label="Waiting Getway Response" @click="searchdevice('zwave')">
                <md-progress-spinner v-if="spinner" md-mode="indeterminate"></md-progress-spinner>
            </md-step>
            <md-step id="Third" md-label="Configure Device" @click="searchdevice('zwave')">
                <md-progress-spinner v-if="spinner" md-mode="indeterminate"></md-progress-spinner>
            </md-step>
        </md-steppers>
    </md-content>
</template>

<script>
    import * as tools from '../../lib/tools.js'
    import devicetypeselector from "./devicetypeselector.vue";
    export default {
        name: 'adddevicestepper',
        data: () => ({
            spinner: false,
            devicetype: null,
            node_uid : null
        }),
        methods: {
            async searchdevice(controler_type = "zwave") {
                this.spinner = true
                //tools.searchdevice(controler_type)
                this.node_uid = await tools.fetchsynctask("6f5ad5e4-ac47-49a4-b27d-b4115859f32b")
                this.spinner = false
                return;
            },
            settype(value) {
                this.devicetype = value
            }
        },
        components: {
            devicetypeselector
        }
    }
</script>

<style scoped>

    .md-scrollbar {
        max-width: 80vh;
        max-height: 50vh;
        overflow: auto;
    }
    .adddevicestepper {
        height: 50vh;
        width: 80vh;
    }


</style>