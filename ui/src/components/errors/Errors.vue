<template>
    <top-nav-bar :title="routeInfo.title" v-if="!isFullScreen()" />
    <section data-component="FILENAME_PLACEHOLDER" class="container errors">
        <div class="img" />
        <h2>{{ $t("errors." + code + ".title") }}</h2>

        <p>
            <span v-html="$t('errors.' + code + '.content')" />
        </p>

        <el-button v-if="!isFullScreen()" tag="router-link" :to="{name: 'home'}" type="primary" size="large">
            {{ $t("back_to_dashboard") }}
        </el-button>
    </section>
</template>

<script>
    import RouteContext from "../../mixins/routeContext";
    import TopNavBar from "../../components/layout/TopNavBar.vue";

    export default {
        mixins: [RouteContext],
        components: {TopNavBar},
        props: {
            code: {
                type: Number,
                required: true
            }
        },
        computed: {
            routeInfo() {
                return {
                    title: this.$t("errors." + this.code + ".title"),
                };
            },
        },
        methods: {
            isFullScreen() {
                return document.getElementsByTagName("html")[0].classList.contains("full-screen");
            }
        },
        watch: {
            $route() {
                this.$store.commit("core/setError", undefined);
            }
        },

    };
</script>


<style lang="scss" scoped>
    .errors {
        margin-top: 0;
        padding-top: 10rem;
        padding-bottom: 3rem;
        text-align: center;
        background: url("../../assets/empty-page.svg") no-repeat top center;

        .img {
            background: url("../../assets/errors/kestra-error.png") no-repeat center;
            background-size: contain;
            max-height: 156px;
        }

        h2 {
            line-height: 30px;
            font-size: 20px;
            font-weight: 600;
        }

        p {
            line-height: 22px;
            font-size: 14px;
        }
    }
</style>
