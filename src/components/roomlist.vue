<template>
    <v-dialog class="roomlist" v-model="roomlist"
              scrollable
              >
        <template v-slot:activator="{ on, attrs }">
            <v-list-item @click="emitopen()"
                          v-bind="attrs"
                          v-on="on">
                <md-icon>list</md-icon>
                <span class="md-list-item-text">Room list</span>
            </v-list-item>
        </template>
        <v-card>
            <v-data-table :headers="headers"
                          :items="rooms"
                          sort-by="name"
                          class="elevation-1">
                <template v-slot:top>
                    <v-toolbar flat>
                        <v-toolbar-title>Room List</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <addroom v-bind:newroom="newroom"
                                 v-bind:editedItem="editedItem"
                                  @click:outside ="close"
                                  @closed="close();initialize()">
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn color="primary"
                                       light
                                       class="mb-2"
                                       v-bind="attrs"
                                       v-on="on"
                                >
                                    New Room
                                </v-btn>
                            </template>
                            <template v-slot:title>
                                {{ formTitle }}
                            </template>
                        </addroom>
                        <v-dialog v-model="dialogDelete" max-width="500px">
                            <v-card>
                                <v-card-title class="headline">Are you sure you want to delete this room?</v-card-title>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                                    <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                                    <v-spacer></v-spacer>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </v-toolbar>
                </template>
                <template v-slot:item.actions="{ item }">
                    <v-icon small
                            class="mr-2"
                            @click="editItem(item)">
                        mdi-pencil
                    </v-icon>
                    <v-icon small
                            @click="deleteItem(item)">
                        mdi-delete
                    </v-icon>
                </template>
                <template v-slot:no-data>
                    <v-btn color="primary"
                           @click="initialize">
                        Reload
                    </v-btn>
                </template>
            </v-data-table>
        </v-card>
    </v-dialog>
</template>

<script>

    import * as tools from '../../lib/tools.js'
    import addroom from './addroom.vue'

    export default {
        name: 'roomlist',
        data: () => ({
            roomlist: false,
            newroom: false,
            dialogDelete: false,
            headers:[],
            action:
                { text: 'Actions', value: 'actions', sortable: false },
            rooms: [],
            editedIndex: -1,
            editedItem: {},
        }),
        components: {
            addroom,
        },

        computed: {
            formTitle() {
                return this.editedIndex === -1 ? 'New room' : 'Edit room'
            },
        },

        watch: {
            dialog(val) {
                val || this.close()
            },
            dialogDelete(val) {
                val || this.closeDelete()
            },
        },

        async mounted() {
            this.initialize()
        },

        methods: {
            async initialize() {
                var roomlist = await tools.getroom()
                if (roomlist) {
                    this.headers = []
                    for (var h of Object.keys(roomlist[0])) {
                        this.headers.push(
                            {
                                text: h,
                                align: 'start',
                                sortable: true,
                                value: h,
                            })
                    }
                    this.headers.push(this.action)
                }
                this.rooms = roomlist
                    
            },

            async emitopen() {
                this.initialize()
                this.roomlist=true
                this.$emit('open')
            },

            editItem(item) {
                this.editedIndex = this.rooms.indexOf(item)
                this.editedItem = Object.assign({}, item)
                this.newroom = true
            },

            deleteItem(item) {
                this.editedIndex = this.rooms.indexOf(item)
                this.editedItem = Object.assign({}, item)
                this.dialogDelete = true
            },

            deleteItemConfirm() {
                tools.removeroom(this.rooms[this.editedIndex].name)
                this.rooms.splice(this.editedIndex, 1)
                this.closeDelete()
            },

            close() {
                this.newroom = false
                this.$nextTick(() => {
                    this.editedIndex = -1
                    this.editedItem = {}
                })
            },

            closeDelete() {
                this.dialogDelete = false
                this.$nextTick(() => {
                    this.editedIndex = -1
                    this.editedItem = {}
                })
            },

            save() {
                if (this.editedIndex > -1) {
                    Object.assign(this.room[this.editedIndex], this.editedItem)
                } else {
                    this.room.push(this.editedItem)
                }
                this.close()
            },
        },
    }
</script>

<style scoped>
    .roomlist {
        min-width: 90%;
        min-height: 90%;
        z-index:1200;
    }
</style>