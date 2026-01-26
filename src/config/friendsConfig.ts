import type { FriendLink, FriendsPageConfig } from "../types/config";

// 可以在src/content/spec/friends.md中编写友链页面下方的自定义内容

// 友链页面配置
export const friendsPageConfig: FriendsPageConfig = {
	// 显示列数：2列或3列
	columns: 2,
};

// 友链配置
export const friendsConfig: FriendLink[] = [
	// 暂时没有友链，可以在这里添加
	// {
	// 	title: "友链名称",
	// 	imgurl: "头像URL",
	// 	desc: "描述",
	// 	siteurl: "网站URL",
	// 	tags: ["标签"],
	// 	weight: 10,
	// 	enabled: true,
	// },
];

// 获取启用的友链并按权重排序
export const getEnabledFriends = (): FriendLink[] => {
	return friendsConfig
		.filter((friend) => friend.enabled)
		.sort((a, b) => b.weight - a.weight);
};
