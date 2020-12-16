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
                    <label for="moduletype">Module Type</label>
                    <md-select v-model="moduletype" name="moduletype" id="moduletype">
                        <md-option value="zwave">zwave</md-option>
                    </md-select>
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

        .diagcontent /deep/ * {
            overflow: auto;
            z-index: 1200;
        }

</style>