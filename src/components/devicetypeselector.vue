<template>
    <v-container fluid>
        <v-row>
            <v-col>
                <v-btn class="switch typelist" height="fit-content" @click="type = 'switch'; emitvalue('switch')">
                    <div class="left">
                        <svgicon icon="switchicon" class='switchicon' />
                    </div>
                    <div class="right">
                        <span> Switch </span>
                    </div>
                </v-btn>
            </v-col>
            <v-col>
                <v-btn class="shutter typelist" height="fit-content" @click="type = 'shutter'; emitvalue('shutter')">
                    <div class="left">
                        <svgicon icon="shuttericon" class='shuttericon' />
                    </div>
                    <div class="right">
                        <span> Shutter </span>
                    </div>
                </v-btn>
            </v-col>
            <v-col>
                <v-btn class="tempsensor typelist" height="fit-content" @click="type = 'tempsensor'; emitvalue('tempsensor')">
                    <div class="left">
                        <v-icon class='tempsensoricon'>fas fa-temperature-half</v-icon>
                    </div>
                    <div class="right">
                        <span> Tempsensor </span>
                    </div>
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import('./icons/')
    export default {
        data: () => ({
            type: null
        }),
        name: 'devicetypeselector',
        methods: {
            emitvalue(type) {
                Object.entries(document.getElementsByClassName('typelist')).forEach(([key, children]) => {
                    if (children.className && children.className.includes('typelist')) {
                        children.style.backgroundColor = 'unset'
                        
                    }
                })

                document.getElementsByClassName(type)[0].style.backgroundColor='lightgrey'
                this.$emit('type', this.type)
            }
        }
    };
</script>

<style scoped>
    .typelist {
        display: flex;
        flex: 1 0 auto;
        flex-wrap: nowrap;
        max-height: 40vh;
        max-width: 80vh;
    }

    .switchicon {
        height: 15vh;
    }
    .switch {
        display: flex;
        flex: 1 1 auto;
        flex-direction: column;
    }
    .shutter {
        display: flex;
        flex: 1 1 auto;
        flex-direction: column;
        background-color: none;
    }
   
    .shuttericon {
        height: 15vh;
    }
    .tempsensor {
        display: flex;
        flex: 1 1 auto;
        flex-direction: column;
        background-color: none;
    }

    .tempsensoricon {
        height: 15vh;
    }
    .right {
        align-self: center;
        font-size: 5vh;
        margin-top:10px;
    }
    .left {
        align-self: center;

    }

</style>