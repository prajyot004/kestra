<template>
    <el-row
        v-for="(item, index) in values"
        :key="'array-' + index"
        :gutter="10"
        class="w-100"
    >
        <el-col :span="22">
            <component
                :is="`task-${getType(schema.items)}`"
                :model-value="item"
                @update:model-value="onInput(index, $event)"
                :root="getKey(index)"
                :schema="schema.items"
                :definitions="definitions"
                :placeholder="$t('value')"
                class="w-100"
            />
        </el-col>
        <el-col :span="2" class="col align-self-center delete">
            <DeleteOutline @click="removeItem(key)" />
        </el-col>
    </el-row>
    <Add @add="addItem()" v-if="values.at(-1)" />
</template>

<script setup>
    import {DeleteOutline} from "../../code/utils/icons";

    import Add from "../../code/components/Add.vue";
</script>

<script>
    import {toRaw} from "vue";
    import Task from "./Task";

    export default {
        mixins: [Task],
        emits: ["update:modelValue"],
        created() {
            if (!Array.isArray(this.modelValue) && this.modelValue !== undefined) {
                this.$emit("update:modelValue", []);
            }
        },
        computed: {
            values() {
                if (this.modelValue === undefined) {
                    return this.schema.default || [undefined];
                }

                return this.modelValue;
            },
        },
        methods: {
            getPropertiesValue(properties) {
                return this.modelValue && this.modelValue[properties]
                    ? this.modelValue[properties]
                    : undefined;
            },
            onInput(index, value) {
                const local = this.modelValue || [];
                local[index] = value;

                this.$emit("update:modelValue", local);
            },
            addItem() {
                let local = this.modelValue || [];
                local.push(undefined);

                // click on + when there is no items
                if (this.modelValue === undefined) {
                    local.push(undefined);
                }

                this.$emit("update:modelValue", local);
            },
            removeItem(x) {
                let local = this.modelValue || [];
                local.splice(x, 1);

                if (local.length === 1) {
                    let raw = toRaw(local[0]);

                    if (raw === null || raw === undefined) {
                        local = undefined;
                    }
                }

                this.$emit("update:modelValue", local);
            },
        },
    };
</script>

<style scoped lang="scss">
@import "../../code/styles/code.scss";
</style>
