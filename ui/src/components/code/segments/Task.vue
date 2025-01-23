<template>
    <TaskEditor
        v-if="!lastBreadcumb.shown"
        v-model="yaml"
        :section
        @update:model-value="validateTask"
    />
    <component
        v-else
        :is="lastBreadcumb.component.type"
        v-bind="lastBreadcumb.component.props"
        v-on="lastBreadcumb.component.listeners"
        :model-value="lastBreadcumb.component.props.modelValue"
        @update:model-value="validateTask"
    />

    <template v-if="yaml">
        <!-- TODO: Improve the validation for single tasks -->
        <ValidationError v-if="false" :errors link />

        <Save
            @click="saveTask"
            :what="route.query.section?.toString()"
            class="w-100 mt-3"
        />
    </template>
</template>

<script setup lang="ts">
    import {ref, watch, computed} from "vue";

    const emits = defineEmits(["updateTask"]);
    const props = defineProps({
        flow: {type: String, required: true},
        creation: {type: Boolean, default: false},
    });

    import {useRouter, useRoute} from "vue-router";
    const router = useRouter();
    const route = useRoute();

    import {SECTIONS} from ".././../../utils/constants";
    const section = ref(SECTIONS.TASKS);

    import TaskEditor from "../../../components/flows/TaskEditor.vue";
    import YamlUtils from "../../../utils/yamlUtils";

    import {useStore} from "vuex";
    const store = useStore();

    const breadcrumbs = computed(() => store.state.code.breadcrumbs);
    const lastBreadcumb = computed(() => {
        const index =
            breadcrumbs.value.length === 3 ? 2 : breadcrumbs.value.length - 1;

        return {
            shown: index >= 2,
            component: breadcrumbs.value?.[index]?.component,
        };
    });

    const yaml = ref(
        YamlUtils.extractTask(props.flow, route.query.identifier)?.toString() || "",
    );

    watch(
        () => route.query.section,
        (value) => {
            section.value = SECTIONS[value === "triggers" ? "TRIGGERS" : "TASKS"];
        },
        {immediate: true},
    );

    watch(
        () => route.query.identifier,
        (value) => {
            if (value === "new") {
                yaml.value = "";
            } else {
                yaml.value =
                    YamlUtils.extractTask(props.flow, value)?.toString() || "";
            }
        },
        {immediate: true},
    );

    import ValidationError from "../../../components/flows/ValidationError.vue";

    const CURRENT = ref(null);
    const validateTask = (task) => {
        let temp = YamlUtils.parse(yaml.value);

        if (lastBreadcumb.value.shown) {
            const field = breadcrumbs.value.at(-1).label;
            temp = {...temp, [field]: task};
        }

        temp = YamlUtils.stringify(temp);

        store
            .dispatch("flow/validateTask", {task: temp, section: section.value})
            .then(() => (yaml.value = temp));

        CURRENT.value = temp;
    };

    const errors = computed(() => store.getters["flow/taskError"]);

    import Save from "../components/Save.vue";
    const saveTask = () => {
        if (lastBreadcumb.value.shown) {
            store.commit("code/removeBreadcrumb", {last: true});
            return;
        }

        const source = props.flow;

        const task = YamlUtils.extractTask(
            yaml.value,
            YamlUtils.parse(yaml.value).id,
        );

        if (route.query.section === SECTIONS.TRIGGERS.toLowerCase()) {
            const existingTask = YamlUtils.checkTaskAlreadyExist(
                source,
                CURRENT.value,
            );
            if (existingTask) {
                store.dispatch("core/showMessage", {
                    variant: "error",
                    title: "Trigger Id already exist",
                    message: `Trigger Id ${existingTask} already exist in the flow.`,
                });
                return;
            }

            emits("updateTask", YamlUtils.insertTrigger(source, CURRENT.value));
            CURRENT.value = null;
        } else {
            const action = props.creation
                ? YamlUtils.insertTask(
                    source,
                    YamlUtils.getLastTask(source),
                    task,
                    "after",
                )
                : YamlUtils.replaceTaskInDocument(
                    source,
                    route.query.identifier,
                    task,
                );

            emits("updateTask", action);
        }

        store.commit("code/removeBreadcrumb", {last: true});

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {section, identifier, type, ...rest} = route.query;
        router.replace({query: {...rest}});
    };
</script>
