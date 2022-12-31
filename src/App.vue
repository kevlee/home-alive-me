  <template>
    <div id="app" class="app">
        <v-app>
            <background />
            <configsidebar />
            <v-main>
                <router-view></router-view>
            </v-main>
            <v-bottom-navigation grow :background-color="color" v-model="value" shift dark>
                <v-btn to="/homepage/">
                    <v-icon>fas fa-home</v-icon>
                </v-btn>
                <v-btn to="/stats/">
                    <v-icon>fas fa-chart-line</v-icon>
                </v-btn>
            </v-bottom-navigation>
        </v-app>
    </div>
</template>


<script>
    import configsidebar from "./components/configsidebar.vue"
    import * as tools from '../lib/tools.js'
    import background from "./components/background.vue";

    export default {
        name: 'App',
        created: () => {
            var scripts = [
                "https://cdn.jsdelivr.net/npm/vue@2.x/dist/vue.js",
                "https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.js"
            ];
            scripts.forEach(script => {
                let tag = document.createElement("script");
                tag.setAttribute("src", script);
                document.head.appendChild(tag);
            });
        },
        data: () => {
            return {
                theme: 'blue',
                value: 0
            }
        },
        components: {
            configsidebar,
            background
        },
        mounted: async function () {
            await tools.getallmodules()
        },
        computed: {
            color () {
                switch (this.value) {
                    case 0: return 'blue darken-2'
                    case 1: return 'teal darken-1'
                    default: return 'blue darken-2'
                }
            }
        }
    }
</script>


<style>
    @import url("https://fonts.googleapis.com/css?family=Material+Icons");
    @import url("https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900");
    @import url("https://cdn.jsdelivr.net/npm/@mdi/font@4.x/css/materialdesignicons.min.css");

    #app {
        margin: 0px;
        padding: 0px;
        overflow: hidden;
    }

    body {
        margin: 0px;
    }

    html.md-theme-default {
    }

    #navbar {
        display: inline-flex;
        align-items: flex-end;
        overflow: hidden;
        position: absolute;
        bottom: 0px;
        width: 100%;
        z-index: 1000;
    }

    body::-webkit-scrollbar {
        width: 7px;
        display: none;
    }

    body::-webkit-scrollbar-track {
        background: #e6e6e6;
        border-left: 1px solid #dadada;
    }

    body::-webkit-scrollbar-thumb {
        background: #757575;
        border: solid 1px #e6e6e6;
        border-radius: 10px;
    }


    
</style>

