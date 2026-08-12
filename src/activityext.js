/**
 * @typedef {Omit<CustomActivity, 'label' | 'dialog' | 'labelSelf' | 'dialogSelf'>} CustomActivityBasic
 */

/**
 * @typedef {Object} ActivityTextTemplate
 * @property {Translation.Entry} label
 * @property {Translation.Entry} dialog
 * @property {Translation.Entry} [labelSelf]
 * @property {Translation.Entry} [dialogSelf]
 */

/** @type {Partial<Record<CustomGroupName, string>>} */
const alterNames = {
    ItemVulva: "ItemPenis",
    ItemVulvaPiercings: "ItemGlans",
};

/**
 * @function
 * @overload
 * @param {CustomActivityBasic} activities
 * @param {Translation.CustomRecord<ActivityGroupName, string>} groupEntry
 * @param {ActivityTextTemplate} template
 * @param {string} [tag] - 用来替换的标签，默认为 "$group"。
 * @returns {CustomActivity}
 */

/**
 * @function
 * @overload
 * @param {CustomActivityBasic[]} activities
 * @param {Translation.CustomRecord<ActivityGroupName, string>} groupEntry
 * @param {ActivityTextTemplate} template
 * @param {string} [tag] - 用来替换的标签，默认为 "$group"。
 * @returns {CustomActivity[]}
 */

/**
 * 从模板生成一个自定义活动。
 *
 * @param {CustomActivityBasic | CustomActivityBasic[]} activity
 * @param {Translation.CustomRecord<ActivityGroupName, string>} groupEntry
 * @param {ActivityTextTemplate} template
 * @param {string} [tag] - 用来替换的标签，默认为 "$group"。
 * @returns {CustomActivity | CustomActivity[]}
 */
function fromTemplateActivity(activity, groupEntry, template, tag = "$group") {
    const langs = Object.keys(groupEntry);

    const pSingle = (activity) => {
        /** @type {CustomActivity} */
        const ret = { ...activity };

        for (const entryTag of Object.keys(template)) {
            if (activity.activity.TargetSelf === undefined && entryTag.includes("Self")) continue;

            /** @type {Translation.Entry} */
            const entryTemplate = template[entryTag];

            const groups =
                entryTag.includes("Self") && activity.activity.TargetSelf !== true
                    ? activity.activity.TargetSelf
                    : activity.activity.Target;

            /** @type {CustomActivity['label']} */
            const entry = {};
            for (const lang of langs) {
                const template = entryTemplate[lang];
                if (template === undefined) continue;
                const groupText = groupEntry[lang];
                const fallback = groupEntry["EN"];
                entry[lang] ??= {};
                for (const group of groups) {
                    if (!groupText[group]) continue;
                    entry[lang][group] = template.replace(tag, groupText[group] ?? fallback[group] ?? group);
                }

                for (const [alt, altTo] of Object.entries(alterNames)) {
                    if (!groups.includes(alt)) continue;
                    if (!groupText[altTo]) continue;
                    entry[lang][altTo] = template.replace(tag, groupText[altTo] ?? fallback[altTo] ?? altTo);
                }
            }
            ret[entryTag] = entry;
        }

        return ret;
    };

    if (Array.isArray(activity)) {
        return activity.map(pSingle);
    } else {
        return pSingle(activity);
    }
}

export const ActivityExt = {
    fromTemplateActivity,
};
