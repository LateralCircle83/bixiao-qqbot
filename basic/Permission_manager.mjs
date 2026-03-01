import Fast_conf from "./Fast_config.mjs";

const conf = new Fast_conf("mag_permission", "mag_permission.json")
await conf.setBaseData({
    "user": {
        1: [],
        2: [],
        [-1]:[]
    },
    "group": {
        1: [],
        2: [],
        [-1]:[]
    },
    "model": {}
})

var data = conf.getAllData()

//权限管理器
/*
个人权限：
0：普通用户
1：管理员
2：高级管理员

群聊权限：
0：不适用bot
1：使用bot，但是严格
2：完全无限制bot

*/

/**
 * 权限管理器
 */
class Mag_per {
    /**
     * 获取qq权限数
     * @param {Number} user_id qq号
     * @returns 
     */
    static getUserPer(user_id) {
        if (data.user[2].includes(Number(user_id))) { return 2 }
        if (data.user[1].includes(Number(user_id))) { return 1 }
        if (data.user[-1].includes(Number(user_id))) { return -1}
        return 0
    }
    /**
     * 获取群权限
     * @param {Number} group_id 群号
     * @returns 
     */
    static getGroupPer(group_id) {
        if (data.group[2].includes(Number(group_id))) { return 2 }
        if (data.group[1].includes(Number(group_id))) { return 1 }
        if (data.group[-1].includes(Number(group_id))) { return -1 }
        return 0
    }
    static async reFresh() {
        data = conf.getAllData()
        return data
    }
    /**
     * 设置qq号权限
     * @param {Number} user_id qq好
     * @param {Number} per 权限值
     */
    static async setUserPer(user_id, per) {
        Mag_per.clearUserPer(user_id)
        switch (per) {
            case 0:
                break
            case 1:
                data.user[1].push(Number(user_id))
                break
            case 2:
                data.user[2].push(Number(user_id))
                break
            case -1:
                data.user[-1].push(Number(user_id))
                break
        }
        conf.writeAllData(data)
        return true
    }
    /**
     * 设置群权限
     * @param {number} group_id 群号
     * @param {number} per 
     * @returns 
     */
    static async setGroupPer(group_id, per) {
        Mag_per.clearGroupPer(group_id)
        switch (per) {
            case 0:
                break
            case 1:
                data.group[1].push(Number(group_id))
                break
            case 2:
                data.group[2].push(Number(group_id))
                break
            case -1:
                data.group[-1].push(Number(group_id))
                break
        }
        conf.writeAllData(data)
        return true
    }
    /**
     * 清除qq号权限
     * @param {number} user_id 
     * @returns 
     */
    static async clearUserPer(user_id) {
        data.user[1] = data.user[1].filter(item => item !== Number(user_id))
        data.user[2] = data.user[2].filter(item => item !== Number(user_id))
        data.user[-1]= data.user[-1].filter(item => item !== Number(user_id))
        return true
    }
    /**
     * 清楚群权限
     * @param {number} group_id 
     * @returns 
     */
    static async clearGroupPer(group_id) {
        data.group[1] = data.group[1].filter(item => item !== Number(group_id))
        data.group[2] = data.group[2].filter(item => item !== Number(group_id))
        data.group[-1]= data.group[-1].filter(item => item !== Number(group_id))
        return true
    }
}
export default Mag_per