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
                        <v-col class="d-flex" md="6">
                            
                        </v-col>
                    </v-row>
                    <v-row justify="end">
                        <v-btn depressed
                               color="primary"
                               @click="validate()">
                            SAVE
                        </v-btn>
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
        }
    }

    export default {
        name: 'addroom',
        data: () => (initialState()),
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
                    //await tools.setmodule(this.moduletype, this.port)
                    //await tools.getallmodules()
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