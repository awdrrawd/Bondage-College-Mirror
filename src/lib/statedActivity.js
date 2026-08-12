/**
 * @template {{}} [CustomStateProperty={}]
 * @default {}
 */
class ActivityStateCtrl {
    /**
     * @typedef {CustomStateProperty & { time: number, target:number}} StateProperty
     */

    /** @type {StateProperty | undefined} */
    state = undefined;

    /**
     * @param {number} [target]
     * @param {CustomStateProperty} [customProps]
     */
    update(target, customProps = /** @type {CustomStateProperty} */ ({})) {
        this.state = {
            ...customProps,
            target: target ?? this.state?.target,
            time: Date.now(),
        };
    }

    clear() {
        this.state = undefined;
    }

    isActive() {
        return this.state !== undefined;
    }

    /**
     * @param {(state: StateProperty) => boolean} func
     */
    check(func) {
        if (this.state === undefined) return false;
        return func(this.state);
    }

    /**
     * @param {number} now
     * @param {number} expireTime
     */
    clearIfExpired(now, expireTime = 8000) {
        if (this.state === undefined) return;
        if (now - this.state.time > expireTime) {
            this.state = undefined;
        }
    }
}

/** @type {ActivityStateCtrl[]} */
const activityStateList = [];

/**
 * @template {{}} [CustomStateProperty={}]
 * @returns {ActivityStateCtrl<CustomStateProperty>}
 */
export function createActivityStateCtrl() {
    const ctrl = new ActivityStateCtrl();
    activityStateList.push(ctrl);
    return /** @type {ActivityStateCtrl<CustomStateProperty>} */ (ctrl);
}

setInterval(() => {
    const now = Date.now();
    for (const stateCtrl of activityStateList) {
        stateCtrl.clearIfExpired(now);
    }
}, 5000);
