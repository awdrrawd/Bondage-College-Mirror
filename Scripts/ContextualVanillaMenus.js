"use strict";

/** @type {{ [K in keyof ContextualMenu.ContextMap]?: (contextData: ContextualMenu.ContextMap[K]) => ContextualMenu.Item[] }} */
var ContextualVanillaMenus = Object.freeze({
	character(data) {
		const char = data?.character;
		if (!char) return [];
		const memberNumber = char.MemberNumber;
		/**
		 * @param {string} message
		 * @returns {boolean}
		 */
		const doConfirm = (message) => confirm(TextSubstitute(message, { $target: `${CharacterNickname(char)} (${memberNumber})` }).join(""));
		const outOfRange = InventoryIsBlockedByDistance(char);
		return [
			{
				type: "button",
				label: TextGet("Examine"),
				icon: "Icons/Public.png",
				callback: () => ChatRoomFocusCharacter(char),
				hidden: Player?.GameplaySettings?.BlindDisableExamine && Player.GetBlindLevel() >= 3 && !char.IsPlayer(),
			},
			{
				type: "button",
				label: TextGet("ChangeClothes"),
				icon: "Icons/Dress.png",
				callback: () => ChatRoomAppearanceLoadCharacter(char),
				hidden: !Player.CanChangeClothesOn(char)
			},
			{
				type: "button",
				label: TextGet("WhisperTarget"),
				icon: "Icons/Whisper.png",
				callback: () => ChatRoomSetTarget(memberNumber),
				hidden: char.IsPlayer() || ChatRoomTargetMemberNumber === char.MemberNumber,
			},
			{
				type: "button",
				label: TextGet("UnwhisperTarget"),
				icon: "Icons/Whisper.png",
				callback: () => ChatRoomSetTarget(-1),
				hidden: !char.IsPlayer() && ChatRoomTargetMemberNumber !== memberNumber || ChatRoomTargetMemberNumber === -1,
			},
			{
				type: "submenu",
				label: TextGet("AdminActions"),
				icon: 'Icons/Admin.png',
				children: [
					{
						type: "button",
						label: TextGet("Kick"),
						callback: () => doConfirm("KickConfirm") && ChatRoomAdminChatAction("Kick", char),
						hidden: char.IsPlayer()
					},
					{
						type: "button",
						label: TextGet("Ban"),
						callback: () => doConfirm("BanConfirm") && ChatRoomAdminChatAction("Ban", char),
						hidden: char.IsPlayer()
					},
					{
						type: "button",
						label: TextGet("Promote"),
						callback: () => ChatRoomAdminChatAction("Promote", char),
						hidden: char.IsPlayer() || ChatRoomCharacterIsAdmin(char)
					},
					{
						type: "button",
						label: TextGet("Demote"),
						callback: () => ChatRoomAdminChatAction("Demote", char),
						hidden: char.IsPlayer() || !ChatRoomCharacterIsAdmin(char)
					},
					{
						type: "button",
						label: TextGet("Whitelist"),
						callback: () => ChatRoomAdminChatAction("Whitelist", char),
						hidden: char.IsPlayer() || ChatRoomCharacterIsWhitelisted(char)
					},
					{
						type: "button",
						label: TextGet("Unwhitelist"),
						callback: () => ChatRoomAdminChatAction("Unwhitelist", char),
						hidden: char.IsPlayer() || !ChatRoomCharacterIsWhitelisted(char)
					},
					{
						type: "button",
						label: TextGet("Move"),
						callback: () => ChatRoomAdminChatAction("Move", char),
						hidden: !ChatRoomIsViewActive("Character")
					},
				],
				hidden: !ChatRoomPlayerIsAdmin(),
			},
			{
				type: "submenu",
				label: TextGet("Relations"),
				icon: "Icons/FriendList.png",
				children: [
					{
						type: "button",
						label: TextGet("FriendNoNotification"),
						callback: () => ChatRoomListUpdate(Player.FriendList, true, memberNumber),
						hidden: ChatRoomCanRemoveFriend(char),
					},
					{
						type: "button",
						label: TextGet("FriendNotification"),
						callback: () => ChatRoomListUpdate(Player.FriendList, true, memberNumber, "FriendRequest"),
						hidden: ChatRoomCanRemoveFriend(char),
					},
					{
						type: "button",
						label: TextGet("Unfriend"),
						callback: () => ChatRoomListUpdate(Player.FriendList, false, memberNumber),
						hidden: ChatRoomCanAddFriend(char),
					},
					{
						type: "button",
						label: TextGet("Whitelist"),
						callback: () => ChatRoomListUpdate(Player.WhiteList, true, memberNumber),
						hidden: ChatRoomCanRemoveWhiteList(char),
					},
					{
						type: "button",
						label: TextGet("Unwhitelist"),
						callback: () => ChatRoomListUpdate(Player.WhiteList, false, memberNumber),
						hidden: ChatRoomCanAddWhiteList(char),
					},
					{
						type: "button",
						label: TextGet("Blacklist"),
						callback: () => ChatRoomListUpdate(Player.BlackList, true, memberNumber),
						hidden: ChatRoomCanRemoveBlackList(char),
					},
					{
						type: "button",
						label: TextGet("Unblacklist"),
						callback: () => ChatRoomListUpdate(Player.BlackList, false, memberNumber),
						hidden: ChatRoomCanAddBlackList(char),
					},
					{
						type: "button",
						label: TextGet("Ghost"),
						callback: () => ChatRoomListUpdate(Player.GhostList, true, memberNumber),
						hidden: ChatRoomCanRemoveGhost(char),
					},
					{
						type: "button",
						label: TextGet("Unghost"),
						callback: () => ChatRoomListUpdate(Player.GhostList, false, memberNumber),
						hidden: ChatRoomCanAddGhost(char),
					},
				],
				hidden: char.IsPlayer()
			},
			{
				type: "submenu",
				label: TextGet("CharacterActions"),
				icon: "Icons/Character.png",
				children: [
					{
						type: "button",
						label: TextGet("AddFocuslist"),
						callback: () => ChatRoomDrawFocusListAdd([char], true),
						hidden: !ChatRoomIsViewActive("Character") || ChatRoomCharacterIsInFocusList(char) || char.IsPlayer()
					},
					{
						type: "button",
						label: TextGet("RemoveFocuslist"),
						callback: () => ChatRoomDrawFocusListRemove([char]),
						hidden: !ChatRoomIsViewActive("Character") || !ChatRoomCharacterIsInFocusList(char) || char.IsPlayer()
					},
					{
						type: "button",
						label: TextGet("HoldLeash"),
						callback: () => ChatRoomHoldLeash(char),
						hidden: outOfRange || !ChatRoomCanHoldLeash(char) || char.IsPlayer(),
					},
					{
						type: "button",
						label: TextGet("ReleaseLeash"),
						callback: () => ChatRoomStopHoldLeash(char),
						hidden: outOfRange || !ChatRoomCanStopHoldLeash(char) || char.IsPlayer(),
					},
					{
						type: "button",
						label: TextGet("HelpStand"),
						callback: () => ChatRoomKneelStandAssist(char),
						hidden: outOfRange || !ChatRoomCanAssistStand(char) || char.IsPlayer(),
					},
					{
						type: "button",
						label: TextGet("HelpKneel"),
						callback: () => ChatRoomKneelStandAssist(char),
						hidden: outOfRange || !ChatRoomCanAssistKneel(char) || char.IsPlayer(),
					},
					{
						type: "button",
						label: TextGet("HelpStruggle"),
						callback: () => ChatRoomStruggleAssist(char),
						hidden: outOfRange || !ChatRoomCanAssistStruggle(char) || char.IsPlayer(),
					},
					{
						type: "button",
						label: TextGet("StopStruggles"),
						callback: () => ChatRoomOnlineStruggleInterrupt(char),
						hidden: outOfRange || !ChatRoomCanInterruptOnlineStruggle(char) || char.IsPlayer(),
					},
					{
						type: "button",
						label: TextGet("StopLeaving"),
						callback: () => ChatRoomStopLeave(char),
						hidden: !ChatRoomCanStopSlowPlayer(char) || char.IsPlayer(),
					},
				]
			},
		];
	},
	chatMessage(data) {
		const msgId = data?.msgId;
		const messageElement = data?.messageElement;
		return [
			{
				type: "button",
				label: InterfaceTextGet("Reply"),
				callback: () => {
					if (msgId) {
						ChatRoomMessageSetReply(msgId);
					}
				},
				hidden: !msgId
			},
			{
				type: "button",
				label: TextGet("CopyMessage"),
				callback: () => ChatRoomCopyMessageText(messageElement),
				hidden: !messageElement
			},
		];
	},
});
