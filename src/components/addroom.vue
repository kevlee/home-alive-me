<template>
    <v-container class="addroom">
        <slot name="activator" :on="on" :attrs="[showaddroom]">
        </slot>

            <v-dialog content-class="dialog"
                      v-model="showaddroomoredit"
                      persistent
                      max-width="500px"
                      @click:outside="close()">
                <v-card class="diagcontent">
                    <v-card-title>
                        <slot name="title">
                            <span class="headline">Add Room</span>
                        </slot>
                    </v-card-title>
                    
                    <v-container class="moduleconfig">
                        <v-form ref="form" name="form"
                                v-model="valid"
                                lazy-validation>
                            <v-row>
                                <v-col class="d-flex">
                                    <v-text-field :rules="ruleroomname"
                                                  outlined
                                                  label="room name"
                                                  v-model="roomdata"></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row class="d-flex">
                                <v-col class="d-flex">
                                    <v-btn class="mr-auto" depressed
                                           color="secondary"
                                           @click="close()">
                                        CANCEL
                                    </v-btn>
                                    <v-btn class="ml-auto" depressed
                                           color="primary"
                                           @click="validate()">
                                        SAVE
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-container>
                </v-card>
            </v-dialog>
    </v-container>
</template>

<script>
    import * as tools from '../../lib/tools.js'


    function initialState() {
        return {
            valid: false,
            roomname: "",
            showaddroom: false,
        }
    }

   

    export default {
        name: 'addroom',
        data: function () {
            let rules = {
                ruleroomname: [
                    value => !!value || 'Required.',
                    value => (value || '').length <= 50 || 'Max 50 characters',
                ]
            }
            let on = {
                on: {
                    click: () => { this.showaddroom = true },
                }
            }
            return Object.assign({}, initialState(), rules, on)
        },
        props:
            [
                'newroom',
                'editedItem'
            ],
        computed: {
            showaddroomoredit() { return this.newroom || this.showaddroom },
            roomdata: {
                get: function () {
                    let nameItem = ""
                    if (this.roomname == "" && this.editedItem && this.editedItem.name) {
                        return this.editedItem.name
                    }
                    return this.roomname
                },
                set: function (value) {
                    this.roomname = value
                }
            }

        },
        methods: {
            close() {
                this.$emit('closed')
                this.$refs.form.resetValidation()
                Object.assign(this.$data, initialState());
            },
            async validate() {
                if (this.$refs.form.validate()) {
                    if (Object.keys(Object.assign({},this.editedItem)).length == 0) {
                        await tools.addroom(this.roomdata)
                    }
                    else {
                        await tools.updateroom(this.editedItem.id,this.roomdata)
                    }
                    this.close()
                }

            },
        },
    }
</script>

<style scoped>

    .addroom {
        width: 30%;
    }

    .diagcontent {
        overflow: auto;
    }

</style>