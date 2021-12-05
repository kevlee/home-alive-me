<template>
    <v-container fluid class="fill-height">
        <v-row no-gutters>
            <v-col justify="space-between" >
                <v-card class="sutter" id="home"
                    color="rgba(255, 255, 255, 0.5)"
                    elevation="9"
                    height="130"
                    shaped
                    width="140">
                    <svgicon name="shuttericon" class='shuttericon' 
                        height='90%'
                        width='100%'></svgicon>
                    <v-chip-group class="d-inline chip-shutter">
                        <v-chip
                            class="pr-1 ma-0"
                            color="green"
                            text-color="white"
                            small
                        >
                            <v-avatar
                                left
                                class="green darken-4"
                            >
                                {{open}}
                            </v-avatar>
                            Open
                        </v-chip>
                        <v-chip
                            class="pr-1 ma-0"
                            color="red"
                            text-color="white"
                            small
                        >
                            <v-avatar
                                left
                                class="red darken-4"
                            >
                                {{close}}
                            </v-avatar>
                            Close
                        </v-chip>
                    </v-chip-group>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>

    import * as tools from '../../lib/tools.js'

    function initialState() {
        return {
            open: 0,
            close: 0,
        }
    }

    export default {
        name: 'dashboard',
        data: () => {
            return initialState()
        },
        methods: {

        },
        asyncComputed: {
            setdashboard: async function () {
                let nodes = await tools.getallnodes()
                for (var node of nodes) {
                    if (node.type == 'shutter'){
                        let curtainlvl = await tools.fetchcurtainlvl(node.nodeuid)
                        if (curtainlvl.value == 0x00){
                            this.close += 1
                        }else{
                            this.open += 1
                        }
                    }
                    
                }

            }

        },
    };
</script>

<style scoped>

.chip-shutter{
    display: flex;
    position: absolute;
    flex-direction: column;
    bottom: 0;
    left: 0;
}

</style>