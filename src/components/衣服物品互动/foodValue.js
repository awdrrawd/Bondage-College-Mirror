class StomachValue {
    constructor() {
        this.value = 0;
        this.latestUpdate = Date.now();
        setInterval(() => {
            const now = Date.now();
            const delta = now - this.latestUpdate;
            this.latestUpdate = now;

            // 每分钟减少 0.1
            this.value = Math.max(this.value - delta / 600000, 0);
        }, 1000);
    }

    /**
     * 获取当前胃部能否进食
     * @returns {boolean}
     */
    canEat() {
        return this.value < 1;
    }

    /**
     * 进食，增加胃部值
     * @param {number} assetValue 食物的胃部值
     */
    eat(assetValue) {
        this.value = this.value + assetValue; // 可以超过1
    }
}

export const playerStomach = new StomachValue();
