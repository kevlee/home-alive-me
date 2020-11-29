<template>
    <div class="typelist">
        <md-button class="switch" @click="type = 'switch'; emitvalue('switch')">
            <div class="left">
                <svgicon name="switchicon" class='switchicon'></svgicon>
            </div>
            <div class="right">
                <span> Switch </span>
            </div>
        </md-button>
        <md-button class="shutter" @click="type = 'shutter'; emitvalue('shutter')">
            <div class="left">
                <svgicon name="shuttericon" class='shuttericon'></svgicon>
            </div>
            <div class="right">
                <span> Shutter </span>
            </div>
        </md-button>
    </div>
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
                Object.entries(document.getElementsByClassName('typelist')[0].childNodes).forEach(([key, children]) => {
                    if (children.className && children.className.includes('md-button')) {
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
        flex-direction: raw;
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
        height: 25vh;
    }
    .shutter {
        display: flex;
        flex: 1 1 auto;
        flex-direction: column;
        height: 25vh;
        background-color: none;
    }
   
    .shuttericon {
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