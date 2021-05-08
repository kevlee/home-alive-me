<template>
    <v-dialog scrollable
              v-model="dialog">
        <template v-slot:activator="{ on, attrs }">
            <v-list-item @click="emitopen()"
                         v-bind="attrs"
                         v-on="on">
                <v-list-item-icon>
                    <v-icon>fas fa-list</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title class="v-list-item-text">Device list</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </template>
        <v-card class="scroller">
            <v-data-table :headers="headers"
                          :items="list"
                          :expanded.sync="expanded"
                          item-key="nodeuid"
                          sort-by="nodeid"
                          class="divicelist"
                          show-expand
                          height="100%"
                          @item-expanded="clickrow($event.item)">
                <template v-slot:top>
                    <v-toolbar flat>
                        <v-toolbar-title>Room List</v-toolbar-title>
                        <v-spacer></v-spacer>
                    </v-toolbar>
                </template>
                <template v-slot:expanded-item="{ headers, item }">
                    <td :colspan="headers.length">
                        <listnodeinfo v-bind:nodeinfo="item"
                                      v-bind:curtainlvl="curtainlvl"
                                      @newconfig="fetchconfig"
                                      @newdata="fetchcurtainlvl" />
                    </td>
                </template>
                <v-divider></v-divider>
            </v-data-table>
        </v-card>
    </v-dialog>
</template>

<script>
    import * as tools from '../../lib/tools.js'
    import listnodeinfo from "./listnodeinfo.vue";

    function initialState() {
        let data = {
            dialog: false,
            list: {},
            clicked: 0,
            configs: [],
            curtainlvl: {},
            headers: [],
            expanded: [],
            expand: { text: '', value: 'data-table-expand' },
        }
        return data
    }
    export default {
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
                if (nodes) {
                    this.headers = []
                    for (var h of Object.keys(nodes[0])) {
                        this.headers.push(
                            {
                                text: h,
                                align: 'start',
                                sortable: true,
                                value: h,
                            })
                    }
                    this.headers.push(this.expand)
                }
                this.list = nodes
            },

            onSelect(event) {
                if (this.clicked == event.nodeid) {
                    return {'background-color':'lightgrey'}
                } else {
                    return {  }
                }
            },
            async clickrow(event) {
                if (this.clicked == event.nodeid) {
                    this.clicked = 0
                } else {
                    this.clicked = event.nodeid
                    await this.fetchconfig(event.nodeuid)
                    if (event.type == 'shutter') {
                         await this.fetchcurtainlvl(event.nodeuid)
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

            async emitopen() {
                initialState()
                this.dialog=true
                this.$emit('open')
            },

            close() {
                Object.assign(this.$data, initialState());
                this.dialog = false
                this.$emit('closed')
            },

        },
        components: {
            listnodeinfo
        },
        beforeMount() {
            this.nodeslist()
        }
    }
</script>
<style scoped lang="scss">

    .scroller {
        overflow: auto;
        width: 100%;
        height: 100%;
    }
    .v-dialog {
        overflow: auto;
        z-index: 1200;
    }
    .v-data-table {
        height: 86%;
    }


</style>
