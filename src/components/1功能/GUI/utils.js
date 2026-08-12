/**
 * @param {string} id
 */
export function getInputElementById(id) {
    return /** @type {HTMLInputElement | null}*/ (document.getElementById(id));
}

/**
 * @param {string} id
 * @returns { {then:(fn:(i:HTMLInputElement)=>void)=>void} }
 */
export function ReqInputElementById(id) {
    const ele = document.getElementById(id);
    if (ele instanceof HTMLInputElement) return { then: (fn) => fn(ele) };
    else return { then: (_) => {} };
}

/**
 * @param {string} id
 * @returns { {then:(fn:(i:HTMLTextAreaElement)=>void)=>void} }
 */
export function ReqTextAreaElementById(id) {
    const ele = document.getElementById(id);
    if (ele instanceof HTMLTextAreaElement) return { then: (fn) => fn(ele) };
    else return { then: (_) => {} };
}

export function ElementInputShowOrCreate(id, type, value, maxLength) {
    const ele = getInputElementById(id);
    if (ele) {
        ele.style.removeProperty("display");
        ele.hidden = false;
    } else {
        ElementCreateInput(id, type, value, maxLength);
    }
}

export function ElementTextAreaShowOrCreate(id, maxLength) {
    const ele = getInputElementById(id);
    if (ele) {
        ele.style.removeProperty("display");
        ele.hidden = false;
        ele.maxLength = maxLength;
    } else {
        ElementCreateTextArea(id).maxLength = maxLength;
    }
}

export function 移除清空输入框(name) {
    const ele = getInputElementById(name);
    if (ele) {
        ele.style.display = "none";
        ele.hidden = true;
        ele.value = ""; // 清空输入框
    }
}

export function 移除清空输入框不清空(name) {
    const ele = getInputElementById(name);
    if (ele) {
        ele.style.display = "none";
        ele.hidden = true;
    }
}
