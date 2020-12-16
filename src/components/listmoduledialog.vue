<template>
    <md-dialog class="md-scrollbar md-content diagcontent"
               :md-active.sync="devicelist"
               md-dialog-content
               :md-click-outside-to-close="false"
               @md-clicked-outside="close()"
               @md-opened="modulelist()">
        <md-content class="scroller md-scrollbar">
            <md-dialog-content class="list">
                <md-table class="md-scrollbar" md-card>
                    <md-table-toolbar>
                        <h1 class="md-title">Devices</h1>
                    </md-table-toolbar>
                    <md-table-row>
                        <md-table-head v-for="(info,key) of list[0]">
                            {{key}}
                        </md-table-head>
                    </md-table-row>
                    <template v-for="(infos,index) in list">
                        <md-table-row class="data"
                                      @click="clickrow(infos)"
                                      :style="onSelect(infos)">
                            <md-table-cell v-for="(info,key) of infos">
                                {{info}}
                            </md-table-cell>
                        </md-table-row>
                        <tr v-if="mustshow(infos.nodeid)">
                            <td :colspan="getlenght(infos)" rowspan="1">
                                <listnodeinfo v-bind:nodeinfo="infos"
                                              v-bind:configs="configs"
                                              v-bind:curtainlvl="curtainlvl"
                                              @newconfig="fetchconfig"
                                              @newdata="fetchcurtainlvl" />
                            </td>
                        </tr>
                    </template>
                </md-table>
            </md-dialog-content>
        </md-content>

    </md-dialog>
</template>

<script>
     name: 'devicelist',
        data: () => (initialState()),
        props: [
            'devicelist'
        ],
        methods: {
            getlenght(infos) {
                return Object.keys(JSON.parse(JSON.stringify(infos))).length

            },
            nodeslist: async function () {
                let nodes = await tools.getallnodes()
                this.list = nodes
            },

            onSelect(event) {
                if (this.clicked == event.nodeid) {
                    return {'background-color':'lightgrey'}
                } else {
                    return {  }
                }
            },
            clickrow(event) {
                if (this.clicked == event.nodeid) {
                    this.clicked = 0
                } else {
                    this.clicked = event.nodeid
                    this.fetchconfig(event.nodeuid)
                    if (event.type == 'shutter') {
                        this.curtainlvl = this.fetchcurtainlvl(event.nodeuid)
                    }
                }
            },
            mustshow(nodeid) {
                return (this.clicked == nodeid)
            },

            async fetchconfig(nodeuid) {
                this.configs = await tools.fetchconfig(nodeuid)
            },
            async fetchcurtainlvl(nodeuid) {
                this.curtainlvl = await tools.fetchcurtainlvl(nodeuid)
            },

            close() {
                Object.assign(this.$data, initialState());
                this.$emit('closed')
            },

        },
        components: {
            listnodeinfo
        },
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

    .md-dialog /deep/ .md-dialog-container {
        min-width: 90%;
        min-height: 90%;
    }

    .md-dialog /deep/ .data {
    }

    .md-dialog /deep/ .md-table {
        width: 100%;
        height: 100%;
    }


    .md-dialog-content /deep/ .save {
        display: flex;
        flex-flow: row-reverse;
    }
</style>