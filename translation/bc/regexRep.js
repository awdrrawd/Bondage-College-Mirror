const act_dialogs = [
    {
        regex: /A magic barrier appear around (.+)\./,
        replacement: "一道魔法屏障出现在$1周围.",
    },
    {
        regex: /(.+)'s body seems to be cursed and the (.+) just falls off her body\./,
        replacement: "$1的身体被施加了诅咒, $2从她身上掉落.",
    },

    // {
    //     regex: /(.+)\./,
    //     replacement: "$1.",
    // },

    // BCC
    // 强制舔腿
    { regex: /(.+) uses "Force lick legs" spell on (.+)/, replacement: '$1 对 $2 使用了 "强制舔腿" 法术' },
    { regex: /(.+) gets on his knees and starts licking (.+) legs/, replacement: "$1 跪下并开始舔 $2 的腿" },

    // 催眠入睡
    { regex: /(.+) uses \"Put to sleep\" spell on himself/, replacement: '$1 自己使用了 "催眠入睡" 法术' },
    { regex: /(.+) uses \"Put to sleep\" spell on (.+)/, replacement: '$1 对 $2 使用了 "催眠入睡" 法术' },
    {
        regex: /(.+) fell asleep, only hot kiss or hard spanking can wake his up/,
        replacement: "$1 睡着了,只有热烈的亲吻或严厉的打屁股才能唤醒他",
    },

    // 移除魔法效果
    { regex: /(.+) uses \"Remove enchantments\" spell on himself/, replacement: '$1 自己使用了 "移除魔法" 法术' },
    { regex: /(.+) uses \"Remove enchantments\" spell on (.+)/, replacement: '$1 对 $2 使用了 "移除魔法" 法术' },
    { regex: /All spell effects were removed from (.+)/, replacement: "所有法术效果从 $1 身上被移除了" },

    // 使其无助
    { regex: /(.+) uses \"Make helpless\" spell on himself/, replacement: '$1 自己使用了 "使无助" 法术' },
    { regex: /(.+) uses \"Make helpless\" spell on (.+)/, replacement: '$1 对 $2 使用了 "使无助" 法术' },
    { regex: /(.+) was enchanted, now he is totally helpless/, replacement: "$1 被施了魔法,现在他完全无助" },
    // 制造幻觉
    { regex: /(.+) uses \"Make hallucination\" spell on himself/, replacement: '$1 自己使用了 "制造幻觉" 法术' },
    { regex: /(.+) uses \"Make hallucination\" spell on (.+)/, replacement: '$1 对 $2 使用了 "制造幻觉" 法术' },
    { regex: /(.+) was subject to hallucinations/, replacement: "$1 开始产生幻觉" },

    // 使说猫语
    { regex: /(.+) uses \"Make cat speech\" spell on himself/, replacement: '$1 自己使用了 "让猫语" 法术' },
    { regex: /(.+) uses \"Make cat speech\" spell on (.+)/, replacement: '$1 对 $2 使用了 "让猫语" 法术' },
    { regex: /(.+) was forced to speak like a cat/, replacement: "$1 被迫像猫一样说话" },

    // 使说婴儿语
    { regex: /(.+) uses \"Make baby speech\" spell on himself/, replacement: '$1 自己使用了 "让婴儿语" 法术' },
    { regex: /(.+) uses \"Make baby speech\" spell on (.+)/, replacement: '$1 对 $2 使用了 "让婴儿语" 法术' },
    { regex: /(.+) was forced to speak like a baby/, replacement: "$1 被迫像婴儿一样说话" },

    // 使说小狗语
    { regex: /(.+) uses \"Make puppy speech\" spell on himself/, replacement: '$1 自己使用了 "让小狗语" 法术' },
    { regex: /(.+) uses \"Make puppy speech\" spell on (.+)/, replacement: '$1 对 $2 使用了 "让小狗语" 法术' },
    { regex: /(.+) was forced to speak like a puppy/, replacement: "$1 被迫像小狗一样说话" },

    // 使说牛语
    { regex: /(.+) uses \"Make cow speech\" spell on himself/, replacement: '$1 自己使用了 "让牛语" 法术' },
    { regex: /(.+) uses \"Make cow speech\" spell on (.+)/, replacement: '$1 对 $2 使用了 "让牛语" 法术' },
    { regex: /(.+) was forced to speak like a cow/, replacement: "$1 被迫像牛一样说话" },

    // 使目标感到情欲
    { regex: /(.+) uses \"Maky horny\" spell on himself/, replacement: '$1 自己使用了 "亢奋" 法术' },
    { regex: /(.+) uses \"Maky horny\" spell on (.+)/, replacement: '$1 对 $2 使用了 "亢奋" 法术' },
    { regex: /(.+) became very horny/, replacement: "$1 变得非常亢奋" },

    // 剥夺声音
    { regex: /(.+) uses \"Take away voice\" spell on himself/, replacement: '$1 自己使用了 "剥夺声音" 法术' },
    { regex: /(.+) uses \"Take away voice\" spell on (.+)/, replacement: '$1 对 $2 使用了 "剥夺声音" 法术' },
    { regex: /(.+) lost his voice/, replacement: "$1 失去了声音" },

    // 控制
    { regex: /(.+) uses \"Control\" spell on himself/, replacement: '$1 自己使用了 "自我控制" 法术' },
    { regex: /(.+) uses \"Control\" spell on (.+)/, replacement: '$1 对 $2 使用了 "控制" 法术' },
    { regex: /(.+) lost control of his body/, replacement: "$1 失去了对自己身体的控制" },

    // 翻转
    { regex: /(.+) uses \"Flip\" spell on himself/, replacement: '$1 自己使用了 "翻转屏幕" 法术' },
    { regex: /(.+) uses \"Flip\" spell on (.+)/, replacement: '$1 对 $2 使用了 "翻转屏幕" 法术' },
    { regex: /(.+)'s screen was flipped/, replacement: "$1 的屏幕被翻转了" },

    // 溶解衣物
    { regex: /(.+) uses \"Dissolve clothes\" spell on himself/, replacement: '$1 自己使用了 "溶解衣物" 法术' },
    { regex: /(.+) uses \"Dissolve clothes\" spell on (.+)/, replacement: '$1 对 $2 使用了 "溶解衣物" 法术' },
    { regex: /(.+)'s clothes were dissolved/, replacement: "$1 的衣物被溶解了" },
];

const pronouns = [
    { regex: /herself/g, replacement: "她自己" },
    { regex: /(her|she)/g, replacement: "她" },
    { regex: /net/g, replacement: "网" },
];

const translationsDTF2 = [
    { regex: /Instruction (.+):/, replacement: "指令 $1:" },
    { regex: /Delete (.+)/, replacement: "删除 $1" },
    { regex: /Delete Spell No. (.+)/, replacement: "删除法术编号 $1" },
    { regex: /Effect (.+):/, replacement: "效果 $1:" },
    { regex: /Spell No. (.+)/, replacement: "法术编号 $1" },
    { regex: /Page (.+)\/(.+)/, replacement: "第 $1 页/$2" },
    { regex: /Background (.+)\/(.+)/, replacement: "背景 第 $1 页/$2" },
    { regex: /Confirm \((.+)\)/, replacement: "确认 ($1)" },
    { regex: /- Little Sera's Club Games v(.+) -/, replacement: "Little Sera 的俱乐部游戏 v$1" },

    {
        regex: /Info: Currently set role: (.+) → Newly selected role: (.+)/,
        replacement: "信息: 当前权限级别: $1 → 新的权限级别: $2",
    },
    { regex: /- View \/ Edit the \'(.+)\' curse -/, replacement: "- 查看 / 编辑 '$1' 诅咒 -" },
    { regex: /Fetish & Activity Compatibility(.+)/, replacement: "癖好 & 动作 癖好相似度$1" },
    { regex: /Compatibility(.+)/, replacement: "癖好相似度$1" },
    {
        regex: /Fetishes\: (.+)\% \｜ Activities \(You \→ 她\)\: (.+)\% \｜ Activities \(她 → You\)\: (.+)\%/,
        replacement: "癖好相似度: $1% ｜ %动作 (你 → 她): $2% ｜ 动作 (她 → 你): $3%",
    },
    {
        regex: /\(\((.+)'s test punishes (.+) meddling with a sharp jolt\.\)/,
        replacement: "(($1 的测试装置以强烈的电击惩罚她的干扰。)",
    },
    {
        regex: /\(\((.+)'s (.+) tightens around (.+), countering (.+) tampering\.\)/,
        replacement: "(($1 的 $2 紧紧束缚住她，阻止她的干扰。)",
    },
    {
        regex: /\(\((.+)'s test tightens around (.+), countering (.+) tampering\.\)/,
        replacement: "(($1 的测试装置紧紧束缚住她，阻止她的干扰。)",
    },
    {
        regex: /\(\((.+)'s test releases a sedating spray, resisting (.+) meddling, and weakening (.+) muscles\.\)/,
        replacement: "(($1 的测试装置释放出镇静喷雾，抵抗她的干扰，并削弱她的肌肉力量。)",
    },
    {
        regex: /\(\((.+) intones with magical power, using nothing but (.+) voice to cast (.+) on (.+)\.\)/,
        replacement: "(($1 以魔法力量吟唱，仅用她的声音对自己施放了 $3。)",
    },
    {
        regex: /\(\((.+) flinches as the item in (.+) hand is flung into the air\.\)/,
        replacement: "(($1 退缩了一下，手中的物品被抛到了空中。)",
    },
    {
        regex: /\(\((.+)'s (.+) clicks menacingly as it resists (.+) tampering\.\)/,
        replacement: "(($1 的 $2 发出威胁性的咔嗒声，抵抗她的干扰。)",
    },
    {
        regex: /\(\((.+)'s (.+) releases a sedating spray, resisting (.+) meddling, and weakening (.+) muscles\.\)/,
        replacement: "(($1 的 $2 释放出镇静喷雾，抵抗她的干扰，并削弱她的肌肉力量。)",
    },
];

export { translationsDTF2, act_dialogs, pronouns };
