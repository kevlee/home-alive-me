<template>
    <v-row>
        <v-col align="end">
            <v-btn icon
                   color="indigo accent-4"
                   @click="
                        showNavigation = true;
                        showaddstepper = false;
                        showdeviceslist = false;
                        showaddmodule = false;
                        ">
                <v-icon>fas fa-bars</v-icon>
            </v-btn>
        </v-col>
        <v-navigation-drawer width="30%"
                             v-model="showNavigation"
                             absolute
                             right
                             temporary>
            <v-toolbar class="md-transparent">
                <span class="md-title">Configuration</span>
            </v-toolbar>

            <v-list>

                <v-subheader>Rooms</v-subheader>
                <v-divider></v-divider>

                <roomlist @open="showNavigation = false;" />

                <v-subheader>Devices</v-subheader>
                <v-divider></v-divider>

                <v-list-item @click="
                                    showaddstepper = true;
                                    showNavigation = false;
                                    showdeviceslist = false;
                                    showaddmodule = false;
                                    ">
                    <md-icon>add</md-icon>
                    <span class="md-list-item-text">Add device</span>
                    <adddevicestepper v-bind:showaddstepper="showaddstepper"
                                      @saved="showaddstepper = false"
                                      @nodevice="showalert" />
                </v-list-item>

                <devicelist @open="showNavigation = false;" />

                <v-list-item>
                    <md-icon>delete</md-icon>
                    <span class="md-list-item-text">Remove device</span>
                </v-list-item>

                <v-subheader>Modules</v-subheader>
                <v-divider></v-divider>
                <v-list-item @click="
                                    showaddstepper = false;
                                    showNavigation = false;
                                    showdeviceslist = false;
                                    showaddmodule = true;
                                    ">
                    <md-icon>add</md-icon>
                    <span class="md-list-item-text">Add module</span>
                    <addmodules v-bind:showaddmodule="showaddmodule"
                                @saved="showaddmodule = false"
                                @closed="showaddmodule = false" />
                </v-list-item>


            </v-list>
        </v-navigation-drawer>
    </v-row>
    
</template>

<script>
    import adddevicestepper from "./adddevicestepper.vue";
    import devicelist from "./devicelist.vue";
    import addmodules from "./addmodules.vue";
    import addroom from "./addroom.vue";
    import roomlist from "./roomlist.vue";

    export default {
        name: 'configsidebar',
        data: () => ({
            spinner : false,
            showaddstepper: false,
            showNavigation: false,
            showdeviceslist: false,
            showaddmodule: false,
            showaddroom: false,
            showroomlist: false,
        }),
        components: {
            adddevicestepper,
            devicelist,
            addmodules,
            addroom,
            roomlist,
        },

        methods: {
            showalert(msg) {
                alert(msg)
            },
        }
    }
    
</script>


<style scoped>

    .header-sidebar {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        width: 100%;
    }
    h4 {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
    }
        h4.button {
            margin-left: 10px;
        }
    .footer-sidebar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
    }
        .footer-sidebar.button {
            border: 0px solid rgba(0,0,0,0) !important;
            border-left: 1px solid rgba(0,0,0,.07) !important;
            border-radius: 0px !important;
        }

    .v-navigation-drawer {
        z-index: 1200;
    }

</style>
