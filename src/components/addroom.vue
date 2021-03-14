<template>
    <v-dialog content-class="dialog"
              v-model="showaddroom"
              persistent
              @click:outside="close()">
        <v-card class="diagcontent">
            <v-card-title>
                <span class="headline">Add Room</span>
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
                                          v-model="roomname"></v-text-field>
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
</template>

<script>
    import * as tools from '../../lib/tools.js'

    function initialState() {
        return {
            valid: false,
            roomname: "",
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
            return Object.assign({}, initialState(), rules)
        },
        props: [
            'showaddroom',
        ],
        methods: {
            close() {
                this.$emit('closed')
                this.$refs.form.resetValidation()
                Object.assign(this.$data, initialState());
            },
            async validate() {
                if (this.$refs.form.validate()) {
                    await tools.addroom(this.roomname)
                    this.close()
                }

            },
        },
    }
</script>

<style scoped>

    .dialog {
        width: 600px;
    }

    .diagcontent {
        overflow: auto;
    }

    .moduleconfig {
        min-width: 600px;
    }
</style>