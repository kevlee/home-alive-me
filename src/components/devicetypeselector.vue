<template>
    <div class="typelist">
        <div class="switch">
            <div class="left">
                <svgicon name="switchicon" class='switchicon'></svgicon>
            </div>
            <div class="right">
                <span> Switch </span>
            </div>
        </div>
        <div class="shutter">
            <div class="left">
                <svgicon name="shuttericon" class='shuttericon'></svgicon>
            </div>
            <div class="right">
                <span> Shutter </span>
            </div>
        </div>
    </div>
</template>

<script>
    import('./icons/')
    export default {
        name: 'devicetypeselector',
        data() {
            return {
                shuttericons: require('../assets/icons/shuttericon.svg')
            };
        },
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
    }
    .shutter {
        display: flex;
        flex: 1 1 auto;
        flex-direction: column;
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