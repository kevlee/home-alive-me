<template>
    <div id="parentx">

        <md-button @click="showNavigation = true" color="primary" type="filled" md-theme="drawer-toolsbar">
            <md-icon class="md-size-100x">menu</md-icon>
        </md-button>

        <md-drawer :md-active.sync="showNavigation" md-swipeable md-right md-fixed md-theme="drawer-toolsbar">
            <md-toolbar class="md-transparent" md-elevation="0">
                <span class="md-title">Configuration</span>
            </md-toolbar>

            <md-list>

                <md-subheader>Rooms</md-subheader>
                <md-divider></md-divider>
                <md-list-item>
                    <md-icon>add</md-icon>
                    <span class="md-list-item-text">Add room</span>
                </md-list-item>

                <md-list-item>
                    <md-icon>delete</md-icon>
                    <span class="md-list-item-text">Remove room</span>
                </md-list-item>

                <md-list-item>
                    <md-icon>list</md-icon>
                    <span class="md-list-item-text">Room list</span>
                </md-list-item>

                <md-subheader>Devices</md-subheader>
                <md-divider></md-divider>

                <md-list-item @click="showaddstepper = true; showNavigation= false">
                    <md-icon>add</md-icon>
                    <span class="md-list-item-text">Add device</span>
                    <adddevicestepper v-bind:showaddstepper="showaddstepper" 
                                      @saved="showaddstepper = false" 
                                      @nodevice="showalert"/>
                </md-list-item>

                <md-list-item>
                    <md-icon>delete</md-icon>
                    <span class="md-list-item-text">Remove device</span>
                </md-list-item>


                <md-list-item>
                    <md-icon>list</md-icon>
                    <span class="md-list-item-text">Device list</span>
                </md-list-item>

            </md-list>
        </md-drawer>
        
    </div>
</template>

<script>
    import adddevicestepper from "./adddevicestepper.vue";

    export default {
        name: 'configsidebar',
        data: () => ({
            spinner : false,
            showaddstepper: false,
            showNavigation: false,
        }),
        components: {
            adddevicestepper
        },
        methods: {
            showalert(msg) {
                alert(msg)
            }
        }
    }
    
</script>

<style lang="scss">
    @import "~vue-material/dist/theme/engine";

    @include md-register-theme("drawer-toolsbar", (
        icon-on-background: md-get-palette-color(lightblue, 800),
    ));
    @import "~vue-material/dist/theme/all";
</style>

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

</style>