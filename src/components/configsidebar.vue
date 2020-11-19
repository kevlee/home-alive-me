<template>
    <div id="parentx">

        <md-button @click="showNavigation = true" color="primary" type="filled">
            <md-icon class="md-size-100x">menu</md-icon>
        </md-button>

        <md-drawer :md-active.sync="showNavigation" md-swipeable md-right md-fixed>
            <md-toolbar class="md-transparent" md-elevation="0">
                <span class="md-title">Configuration</span>
            </md-toolbar>

            <md-list>
                <md-list-item @click="showaddstepper = true; showNavigation= false">
                    <md-icon>add</md-icon>
                    <span class="md-list-item-text">Add device</span>
                </md-list-item>

                <md-list-item>
                    <md-icon>send</md-icon>
                    <span class="md-list-item-text">Sent Mail</span>
                </md-list-item>

                <md-list-item>
                    <md-icon>delete</md-icon>
                    <span class="md-list-item-text">Trash</span>
                </md-list-item>

                <md-list-item>
                    <md-icon>error</md-icon>
                    <span class="md-list-item-text">Spam</span>
                </md-list-item>
            </md-list>
        </md-drawer>
        <md-dialog :md-active.sync="showaddstepper">
            <md-steppers>
                <md-step id="first" md-label="First Step">
                    <p>Select the device </p>
                </md-step>
                <md-step id="Second" md-label="Second Step" :function="searchdevice('zwave')">
                    <md-progress-spinner v-if="spinner" md-mode="indeterminate"></md-progress-spinner>
                </md-step>
            </md-steppers>
        </md-dialog>
    </div>
</template>

<script>
    export default {
        name: 'configsidebar',
        data: () => ({
            spinner : false,
            showaddstepper: false,
            showNavigation: false,
            items: [
                ['mdi-email', 'Inbox'],
                ['mdi-account-supervisor-circle', 'Supervisors'],
                ['mdi-clock-start', 'Clock-in'],
            ],
        }),
        methods: {
            searchdevice: function (controler_type = "zwave") {
                if (controler_type == "zwave") {
                    this.spinner = true
                    //this.spinner = false
                }
                return;
            },
        },
    }

   /* function searchdevice(controler_type = "zwave") {
        if (controler_type == "zwave") {
            document.getSelection.spinner = true;
        }
        return;
    }*/
    
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

</style>