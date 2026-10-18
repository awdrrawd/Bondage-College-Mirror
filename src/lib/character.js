/**
 *
 * @param {Character} c
 * @returns {c is OnlineCharacter}
 */
export function isOnlineCharacter(c) {
    return typeof (/** @type {any} */ (c).MemberNumber) === "number";
}
