<template>
    <md-dialog ref="diagcontent" class="md-scrollbar md-content diagcontent" 
               :md-active.sync="showaddmodule" 
               md-dialog-content 
               :md-click-outside-to-close="false" 
               @md-clicked-outside="close()"
               @md-opened="getmodule()">
        <md-content class="scroller md-scrollbar">
            <md-dialog-content class="addmodule">
                <md-field>
                    <v-select :items="items"
                              label="Outlined style"
                              v-model="moduletype"
                              outlined>
                    </v-select>
                </md-field>
            </md-dialog-content>
        </md-content>
    </md-dialog>
</template>

<script>

    import * as tools from '../../lib/tools.js'

    function initialState() {
        return {
            availablemodule: null,
            portlist: null,
            moduletype: null,
            items: ["zwave"]
        }
    }

    export default {
        name: 'addmodules',
        data: () => (initialState()),
        props: [
            'showaddmodule'
        ],
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
    .scroller {
        overflow: auto;
        width: 100%;
    }

    .diagcontent {
        overflow: auto;
        z-index: 1200;
    }

    .md-option {
        z-index: 1200 !important;
    }

</style>