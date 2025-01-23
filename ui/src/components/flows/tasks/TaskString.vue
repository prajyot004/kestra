<template>
    <template v-if="schema.format === 'duration'">
        <el-time-picker
            :model-value="durationValue"
            type="time"
            :default-value="defaultDuration"
            @update:model-value="onInputDuration"
        />
    </template>
    <template v-else>
        <InputText
            :model-value="editorValue"
            @update:model-value="onInput"
            class="w-100"
        />
    </template>
</template>
<script>
    import Task from "./Task";
    import InputText from "../../../components/code/components/inputs/InputText.vue";

    export default {
        mixins: [Task],
        components: {InputText},
        emits: ["update:modelValue"],
        computed: {
            isValid() {
                if (this.required && !this.modelValue) {
                    return false;
                }

                if (this.schema.regex && this.modelValue) {
                    return RegExp(this.schema.regex).test(this.modelValue);
                }

                return true;
            },
            durationValue() {
                if (typeof this.values === "string") {
                    const duration = this.$moment.duration(this.values);

                    return new Date(
                        1981,
                        1,
                        1,
                        duration.hours(),
                        duration.minutes(),
                        duration.seconds(),
                    );
                }

                return undefined;
            },
            defaultDuration() {
                return this.$moment().seconds(0).minutes(0).hours(0).toDate();
            },
        },
        methods: {
            onInputDuration(value) {
                const emitted =
                    value === "" || value === null
                        ? undefined
                        : this.$moment
                            .duration({
                                seconds: value.getSeconds(),
                                minutes: value.getMinutes(),
                                hours: value.getHours(),
                            })
                            .toString();

                this.$emit("update:modelValue", emitted);
            },
        },
    };
</script>
