<template>
    <md-content class="md-scrollbar">
        <md-steppers class="adddevicestepper md-scrollbar">
            <md-step id="first" md-label="First Step">
                <devicetypeselector />
            </md-step>
            <md-step id="Second" md-label="Second Step" @click="searchdevice('zwave')">
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
            spinner: false
        }),
        methods: {
            searchdevice(controler_type = "zwave") {
                this.spinner = true
                setTimeout(() => {
                    this.spinner = false
                    alert('no device find')
                }, 30000)
                //tools.searchdevice(controler_type)
                return;
            },
        },
        computed: {
            mycss() {
                return {
                    'max-height': '${screen.height}px',
                    'max-width': '${screen.max-width}px'
                }
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