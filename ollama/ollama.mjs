import Reg_cmd from "../basic/Command_register.mjs";
import Fast_conf from "../basic/Fast_config.mjs";
import { Eazy_post, napcat } from "../basic/napcat_conntection.mjs";
import Mag_per from "../basic/Permission_manager.mjs";
import Ai from "./ollama_conntection.mjs";

const conf = new Fast_conf("ollama", "ollama_conf.json")
conf.setBaseData({
    isStart: false,
    url: "",
    model: "",
    temperature: 1.3,
    top_k: 64,
    top_p: 0.95,
    max_chating: 10,
    sys_prompt: "",
    identity: { "black": [-1] },
    data: {}
})
//data:{114514:{"sys_prompt":"","status":true,"identity":{"":[2],"":[]}}}
const conf_data = conf.getAllData()
//{12345:[]}
const history = {}

ollama()
export function ollama() {
    //注册命令
    const cmd = new Reg_cmd("ollama", ":ollama", 2, 0)
    cmd.setDiscript("ollama管理")
    //全局设置
    cmd.setLine([Reg_cmd.choose("config"), Reg_cmd.choose("get")], [Reg_cmd.text("项")])
    cmd.setLine([Reg_cmd.choose("config"), Reg_cmd.choose("set"), Reg_cmd.text("项"), Reg_cmd.text("值")])
    cmd.setLine([Reg_cmd.choose("config"), Reg_cmd.choose("sys_prompt"), Reg_cmd.choose("get")])
    cmd.setLine([Reg_cmd.choose("config"), Reg_cmd.choose("sys_prompt"), Reg_cmd.choose("set"), Reg_cmd.text()])
    cmd.setLine([Reg_cmd.choose("config"), Reg_cmd.choose("identity"), Reg_cmd.choose("add"), Reg_cmd.text("组"), Reg_cmd.number("qqid")])
    cmd.setLine([Reg_cmd.choose("config"), Reg_cmd.choose("identity"), Reg_cmd.choose("add"), Reg_cmd.text("组"), Reg_cmd.at("qqid")])
    cmd.setLine([Reg_cmd.choose("config"), Reg_cmd.choose("identity"), Reg_cmd.choose("get")], [Reg_cmd.text("组")])
    cmd.setLine([Reg_cmd.choose("config"), Reg_cmd.choose("identity"), Reg_cmd.choose("del"), Reg_cmd.text("组")], [Reg_cmd.text("qqid")])
    cmd.setLine([Reg_cmd.choose("config"), Reg_cmd.choose("identity"), Reg_cmd.choose("del"), Reg_cmd.text("组")], [Reg_cmd.at("qqid")])
    //对单个群聊
    cmd.setLine([Reg_cmd.choose("group"), Reg_cmd.choose("this"), Reg_cmd.choose("allow")])
    cmd.setLine([Reg_cmd.choose("group"), Reg_cmd.choose("this"), Reg_cmd.choose("forbid")])
    cmd.setLine([Reg_cmd.choose("group"), Reg_cmd.choose("this"), Reg_cmd.choose("sys_prompt"), Reg_cmd.choose("get")])
    cmd.setLine([Reg_cmd.choose("group"), Reg_cmd.choose("this"), Reg_cmd.choose("sys_prompt"), Reg_cmd.choose("set"), Reg_cmd.text()])
    cmd.setLine([Reg_cmd.choose("group"), Reg_cmd.choose("this"), Reg_cmd.choose("identity"), Reg_cmd.choose("add"), Reg_cmd.text("组"), Reg_cmd.number("qqid")])
    cmd.setLine([Reg_cmd.choose("group"), Reg_cmd.choose("this"), Reg_cmd.choose("identity"), Reg_cmd.choose("add"), Reg_cmd.text("组"), Reg_cmd.at("qqid")])
    cmd.setLine([Reg_cmd.choose("group"), Reg_cmd.choose("this"), Reg_cmd.choose("identity"), Reg_cmd.choose("get")], [Reg_cmd.text("组")])
    cmd.setLine([Reg_cmd.choose("group"), Reg_cmd.choose("this"), Reg_cmd.choose("identity"), Reg_cmd.choose("del"), Reg_cmd.text("组")], [Reg_cmd.text("qqid")])
    cmd.setLine([Reg_cmd.choose("group"), Reg_cmd.choose("this"), Reg_cmd.choose("identity"), Reg_cmd.choose("del"), Reg_cmd.text("组")], [Reg_cmd.at("qqid")])
    cmd.setLine([Reg_cmd.choose("group"), Reg_cmd.choose("this"), Reg_cmd.choose("identity"), Reg_cmd.choose("def"), Reg_cmd.choose("true", "false")])
    cmd.setLine([Reg_cmd.choose("group"), Reg_cmd.number("群id"), Reg_cmd.choose("allow")])
    cmd.setLine([Reg_cmd.choose("group"), Reg_cmd.number("群id"), Reg_cmd.choose("forbid")])
    cmd.setLine([Reg_cmd.choose("group"), Reg_cmd.number("群id"), Reg_cmd.choose("sys_prompt"), Reg_cmd.choose("get")])
    cmd.setLine([Reg_cmd.choose("group"), Reg_cmd.number("群id"), Reg_cmd.choose("sys_prompt"), Reg_cmd.choose("set"), Reg_cmd.text()])
    cmd.setLine([Reg_cmd.choose("group"), Reg_cmd.number("群id"), Reg_cmd.choose("identity"), Reg_cmd.choose("add"), Reg_cmd.text("组"), Reg_cmd.number("qqid")])
    cmd.setLine([Reg_cmd.choose("group"), Reg_cmd.number("群id"), Reg_cmd.choose("identity"), Reg_cmd.choose("get")], [Reg_cmd.text("组")])
    cmd.setLine([Reg_cmd.choose("group"), Reg_cmd.number("群id"), Reg_cmd.choose("identity"), Reg_cmd.choose("del"), Reg_cmd.text("组")], [Reg_cmd.text("qqid")])
    cmd.setLine([Reg_cmd.choose("group"), Reg_cmd.number("群id"), Reg_cmd.choose("identity"), Reg_cmd.choose("def"), Reg_cmd.choose("true", "false")])
    //获取历史记录
    cmd.setLine([Reg_cmd.choose("all"), Reg_cmd.choose("history"), Reg_cmd.choose("get", "clear")])
    cmd.setLine([Reg_cmd.choose("group"), Reg_cmd.choose("this"), Reg_cmd.choose("history"), Reg_cmd.choose("get", "clear")])
    cmd.setLine([Reg_cmd.choose("group"), Reg_cmd.number("群id"), Reg_cmd.choose("history"), Reg_cmd.choose("get", "clear")])
    cmd.setLine([Reg_cmd.choose("user"), Reg_cmd.choose("history"), Reg_cmd.choose("get", "clear")])
    //获取单回复
    cmd.setLine([Reg_cmd.choose("generate"), Reg_cmd.text("prompt")], [Reg_cmd.text("系统提示词"), Reg_cmd.text("身份"), Reg_cmd.text("nick")])
    // cmd.setLine([Reg_cmd.choose("identity"),Reg_cmd.choose("add"),Reg_cmd.number,Reg_cmd.text],[Reg_cmd.choose("group")])
    // cmd.setLine([Reg_cmd.choose("identity")])
    // cmd.setLine([Reg_cmd.choose("identity"),Reg_cmd.choose("get")],[Reg_cmd.text])
    // cmd.setLine([Reg_cmd.choose("sys_prompt"), Reg_cmd.choose("set"), Reg_cmd.text], [Reg_cmd.choose("group", "user"), Reg_cmd.number])
    // cmd.setLine([Reg_cmd.choose("sys_prompt"), Reg_cmd.choose("get")], [Reg_cmd.choose("group", "user"), Reg_cmd.number])
    // cmd.setLine([Reg_cmd.choose("history"), Reg_cmd.choose("get", "clear"), Reg_cmd.choose("group", "user", "all")], [Reg_cmd.number])
    // cmd.setLine([Reg_cmd.choose("generate"), Reg_cmd.text], [Reg_cmd.text,Reg_cmd.text])
    cmd.setCallback(async (data, root, user_id, self_id, _group_id, _reply, _context) => {
        if (data[0] === "config") {
            if (data[1] === "get") {
                if (!data[2]) {
                    const { sys_prompt, identity, data, ...other } = conf_data
                    await Eazy_post.content("[Ollama]" + JSON.stringify(other, null, 1), user_id, _group_id)
                    return
                }
                if (conf_data[data[2]] || conf_data[data[2]] === false || conf_data[data[2]] === 0) {
                    await Eazy_post.content("[Ollama]\/config\/\"" + data[2] + "\":" + conf_data[data[2]], user_id, _group_id)
                    return
                }
                await Eazy_post.content("[Ollama]\/config\/找不到此项", user_id, _group_id)
                return
            }
            if (data[1] === "set") {
                if (!conf_data[data[2]] && conf_data[data[2]] !== false && conf_data[data[2]] !== 0) {
                    await Eazy_post.content("[Ollama]\/config\/找不到此项", user_id, _group_id)
                    return
                }
                const write = ((typeof conf_data[data[2]] === "number") && Number(data[3])) || ((typeof conf_data[data[2]] === "boolean") && JSON.parse(data[3])) || data[3]
                conf_data[data[2]] = write
                conf.writeKeyData(data[2], write)
                await Eazy_post.content("[Ollama]\/config\/已设置\"" + data[2] + "\"为" + "\"" + data[3] + "\"", user_id, _group_id)
                return
            }
            if (data[1] === "identity") {
                if (data[2] === "add") {
                    const array_data = (conf_data.identity[data[3]] && conf_data.identity[data[3]].concat(data[4])) || [data[4]]
                    conf_data.identity[data[3]] = array_data
                    conf.writeAllData(conf_data)
                    await Eazy_post.content("[Ollama]\/config\/已将" + data[4] + "加入身份\"" + data[3] + "\"身分组", user_id, _group_id)
                    return
                }
                if (data[2] === "get") {
                    if (data[3] && !conf_data.identity[data[3]]) {
                        await Eazy_post.content("[Ollama]\/config\/未找到\"" + data[3] + "\"身分组", user_id, _group_id)
                        return
                    }
                    if (data[3] && conf_data.identity[data[3]]) {
                        await Eazy_post.content("[Ollama]\/config\/身分组\"" + data[3] + "\":" + conf_data.identity[data[3]].join(), user_id, _group_id)
                        return
                    }
                    const output = ["[Ollama]\/config\/有以下身分组:"]
                    for (let key in conf_data.identity) {
                        output.push(` - "${key}":[${conf_data.identity[key].join()}]`)
                    }
                    await Eazy_post.content(output.join("\n"), user_id, _group_id)
                    return
                }
                if (data[2] === "del") {
                    if (!conf_data.identity[data[3]]) {
                        await Eazy_post.content("[Ollama]\/config\/未找到身分组\"" + data[3] + "\"", user_id, _group_id)
                        return
                    }
                    if (!data[4]) {
                        delete conf_data.identity[data[3]]
                        conf.writeAllData(conf_data)
                        await Eazy_post.content("[Ollama]\/config\/已删除身分组\"" + data[3] + "\"", user_id, _group_id)
                        return
                    }
                    conf_data.identity[data[3]] = conf_data.identity[data[3]].filter(item => item !== Number(data[4]))
                    conf.writeAllData(conf_data)
                    await Eazy_post.content("[Ollama]\/config\/已删除\"" + data[3] + "\"中的" + data[4], user_id, _group_id)
                    return
                }
                return
            }
            if (data[1] === "sys_prompt") {
                if (data[2] === "set") {
                    conf_data.sys_prompt = data[3]
                    conf.writeKeyData("sys_prompt", data[3])
                    await Eazy_post.content("[Ollama]\/config\/已设置系统提示词", user_id, _group_id)
                    return
                }
                if (data[2] === "get") {
                    await Eazy_post.content("[Ollama]\/config\/系统提示词:" + conf_data.sys_prompt, user_id, _group_id)
                    return
                }
                return
            }
        }
        if (data[0] === "group") {
            let group
            if (data[1] === "this") {
                if (!_group_id) {
                    await Eazy_post.content("[Ollama]\/group\/没有输入有效的群聊", user_id, _group_id)
                    return
                }
                group = _group_id
            } else {
                group = data[1]
            }
            if (data[2] === "allow") {
                if (!conf_data.data[group]) {
                    conf_data.data[group] = { "status": true, sys_prompt: "default", identity: { "default": true } }
                } else {
                    conf_data.data[group].status = true
                }
                conf.writeAllData(conf_data)
                await Eazy_post.content("[Ollama]\/group\/已开启群聊" + group + "的回复权限", user_id, _group_id)
                return
            }
            if (data[2] === "forbid") {
                if (!conf_data.data[group]) {
                    conf_data.data[group] = { "status": false, sys_prompt: "default", identity: { "default": true } }
                } else {
                    conf_data.data[group].status = false
                }
                conf.writeAllData(conf_data)
                await Eazy_post.content("[Ollama]\/group\/已关闭群聊" + group + "的回复权限", user_id, _group_id)
                return
            }
            if (data[2] === "sys_prompt") {
                if (!conf_data.data[group]) {
                    conf_data.data[group] = { "status": false, sys_prompt: "default", identity: { "default": true } }
                }
                if (data[3] === "get") {
                    await Eazy_post.content("[Ollama]\/group\/群聊" + group + "的系统提示词为" + conf_data.data[group].sys_prompt, user_id, _group_id)
                    return
                }
                if (data[3] === "set") {
                    conf_data.data[group].sys_prompt = data[4]
                    conf.writeAllData(conf_data)
                    await Eazy_post.content("[Ollama]\/group\/已设置" + group + "系统提示词", user_id, _group_id)
                    return
                }
                return
            }
            if (data[2] === "identity") {
                if (!conf_data.data[group]) {
                    conf_data.data[group] = { "status": false, sys_prompt: "default", identity: { "default": true } }
                }
                if (data[3] === "add") {
                    const array_data = (conf_data.data[group].identity[data[4]] && conf_data.data[group].identity[data[4]].concat(data[5])) || [data[5]]
                    conf_data.data[group].identity[data[4]] = array_data
                    conf.writeAllData(conf_data)
                    await Eazy_post.content("[Ollama]\/group\/已将" + data[5] + "加入群聊" + group + "\"" + data[4] + "\"身分组", user_id, _group_id)
                    return
                }
                if (data[3] === "get") {
                    if (data[4] && !conf_data.data[group].identity[data[4]]) {
                        await Eazy_post.content("[Ollama]\/group\/未找到群聊" + group + "存在\"" + data[4] + "\"身分组", user_id, _group_id)
                        return
                    }
                    if (data[4] && conf_data.data[group].identity[data[4]]) {
                        await Eazy_post.content("[Ollama]\/group\/" + group + "身分组\"" + data[3] + "\":" + conf_data.data[group].identity[data[4]].join(), user_id, _group_id)
                        return
                    }
                    const output = ["[Ollama]\/group\/" + group + "有以下身分组:"]
                    for (let key in conf_data.data[group].identity) {
                        if (key === "default") continue
                        output.push(` - "${key}":[${conf_data.data[group].identity[key].join()}]`)
                    }
                    await Eazy_post.content(output.join("\n"), user_id, _group_id)
                    return
                }
                if (data[3] === "del") {
                    if (!conf_data.data[group].identity[data[4]]) {
                        await Eazy_post.content("[Ollama]\/group\/未找到群聊" + group + "中身分组\"" + data[4] + "\"", user_id, _group_id)
                        return
                    }
                    if (!data[5]) {
                        delete conf_data.data[group].identity[data[4]]
                        conf.writeAllData(conf_data)
                        await Eazy_post.content("[Ollama]\/group\/已删除群聊" + group + "中身分组\"" + data[4] + "\"", user_id, _group_id)
                        return
                    }
                    //console.log(conf_data.data[group].identity[data[4]].filter(item => item !== data[5]))
                    conf_data.data[group].identity[data[4]] = conf_data.data[group].identity[data[4]].filter(item => item !== Number(data[5]))
                    conf.writeAllData(conf_data)
                    await Eazy_post.content("[Ollama]\/group\/已删除群聊" + group + "身分组\"" + data[4] + "\"中的" + data[5], user_id, _group_id)
                    return
                }
                if (data[3] === "def") {
                    conf_data.data[group].identity["default"] = (data[4] === "true" && true) || (data[4] === "false" && false)
                    conf.writeAllData(conf_data)
                    await Eazy_post.content("[Ollama]\/group\/已设置群聊" + group + "身分组" + `${(data[4] === "false" && "不") || ""}` + "遵循默认", user_id, _group_id)
                    return
                }
                return
            }
            if (data[2] === "history") {
                if (!history[group]) {
                    await Eazy_post.content("[Ollama]\/group\/群聊" + group + "没有记录", user_id, _group_id)
                    return
                }
                if (data[3] === "get") {
                    await Eazy_post.content_forward(history[group], "ollama", user_id, _group_id, true)
                    return
                }
                if (data[3] === "clear") {
                    delete history[group]
                    await Eazy_post.content("[Ollama]\/group\/已清楚群聊" + group + "记录", user_id, _group_id)
                    return
                }
                return
            }
        }
        if (data[0] === "all") {
            if (data[1] === "history") {
                if (data[2] === "get") {
                    if (Object.keys(history).length === 0) {
                        await Eazy_post.content("[Ollama]\/all\/目前无记录", user_id, _group_id)
                        return
                    }
                    for (let key in history) {
                        await Eazy_post.content_forward(history[key], "ollama", user_id, _group_id, true)
                    }
                    return
                }
                if (data[2] === "clear") {
                    Object.keys(history).forEach(key => {
                        delete history[key]
                    })
                    await Eazy_post.content("[Ollama]\/all\/已清除全部历史", user_id, _group_id)
                    return
                }
                return
            }
            return
        }
        if (data[0] === "user") {
            if (data[1] === "history") {
                if (data[2] === "get") {
                    await Eazy_post.content_forward(history.user, "ollama", user_id, _group_id, true)
                    return
                }
                if (data[2] === "clear") {
                    delete history.user
                    await Eazy_post.content("[Ollama]\/user\/已清楚user记录", user_id, _group_id)
                    return
                }
                return
            }
            return
        }
        if (data[0] === "generate") {
            if (isExecutable() !== true) {
                await Eazy_post.content(isExecutable(), user_id, _group_id)
                return
            }
            let reply
            if (_reply) {
                const request = await napcat.get_msg({
                    message_id: _reply
                })
                reply = { nick: (request.user_id === request.self_id && "你") ||request.sender.nickname, content: Reg_cmd.getSpecialMag(request.raw_message).content }
            }
            const request = await Ai.generate({ prompt: await Ai_chat.format_cq(Ai_chat.format_prompt(data[1], (data[4] !== "default" && data[4]) || _context.sender.nickname, (data[3] === "null" && []) || (data[3] && data[3].split(",")) || [], reply)), system: (data[2] === "default" && conf_data.sys_prompt) || (data[2] === "null" && null) || data[2] || conf_data.sys_prompt }, conf_data.url, conf_data.model, conf_data.temperature, conf_data.top_k, conf_data.top_p)
            await Eazy_post.content(`$#@<_at>${user_id}$#@${(!request && "回复获取发生错误") || request.response}`, user_id, _group_id)
            return
        }
    })
    cmd.Loading()
}

function isExecutable() {
    if (!conf_data.url) {
        return "[Ollama]\/config\/无效的url"
    }
    if (!conf_data.model) {
        return "[Ollama]\/config\/无效的模型名称"
    }
    return true
}
// /**
//  * 格式化身份消息
//  * @param {string} ori 原消息
//  * @param {string} _nick 昵称
//  * @param {Array} _identity 身份
//  * @param {{nick:"nick",content:"content"}} _reply 回复的消息内容
//  * @return {string} 返回
//  */
// function format_prompt(ori, _nick = "某人", _identity = [], _reply) {
//     console.log(_nick, `${_nick || "某人"}${_identity.map(value => "(" + value + ")").join("")}${(_reply && ("回复了" + _reply.nick + "的消息:\"" + _reply.content + "\"")) || ""}对你说:"${ori}"`)
//     return `${_nick || "某人"}${_identity.map(value => "(" + value + ")").join("")}${(_reply && ("回复了" + _reply.nick + "的消息:\"" + _reply.content + "\"")) || ""}对你说:"${ori}"`
// }

export class Ai_chat {
    static async test_ai(context, user_id, _self_id, _group_id) {
        if (_group_id && (!conf_data.data[_group_id] || !conf_data.data[_group_id].status)) { return false }
        const request = Reg_cmd.getSpecialMag(context.raw_message)
        if (request.reply) {
            if (request.at !== context.self_id) {
                const rp = await napcat.get_msg({ message_id: request.reply })
                if (rp.user_id !== context.self_id) {
                    return false
                }
            }
        }
        if (!request.reply && request.at !== context.self_id) { return false }
        const identity = Ai_chat.get_identity(user_id, _group_id)
        if (identity.includes("black")) { return false }
        let reply
        if (request.reply) {
            const get_reply = await napcat.get_msg({ message_id: request.reply })
            reply = { nick: (get_reply.user_id === context.self_id && "你") || get_reply.sender.nickname, content: Reg_cmd.getSpecialMag(get_reply.raw_message).content.replace(/(?:&#91;|\[)\d+\/\d+(?:&#93;|\])$/, '') }
        }
        //console.log(reply)
        console.log(Ai_chat.format_prompt(request.content, context.sender.nickname, identity, reply))
        const prompt = await Ai_chat.format_cq(Ai_chat.format_prompt(request.content, context.sender.nickname, identity, reply))
        let his = (() => {
            if (_group_id) {
                if (!history[_group_id]) { history[_group_id] = [] }
                if (history[_group_id].length >= 2 * conf_data.max_chating) { history[_group_id] = [] }
                return history[_group_id]
            }
            if (!history.user) { history.user = [] }
            if (history.user.length === 2 * conf_data.max_chating) { history.user = [] }
            return history.user
        })()
        console.log(his)
        const ai_request = await Ai.chat(his, { "system": (() => { if (_group_id) { if (conf_data.data[_group_id].sys_prompt === "default") { return conf_data.sys_prompt }; return conf_data.data[_group_id].sys_prompt }; return conf_data.sys_prompt })(), "prompt": prompt }, conf_data.url, conf_data.model, conf_data.temperature, conf_data.top_k, conf_data.top_p)
        console.log(JSON.stringify(history))
        if (!ai_request) { return false }
        history[_group_id || "user"].push("user:" + prompt)
        history[_group_id || "user"].push("assistant:" + ai_request.response)
        console.log(history)
        await Eazy_post.content(ai_request.response + "[" + (his.length / 2) + "/" + conf_data.max_chating + "]", user_id, _group_id)
        return true
    }
    static get_identity(user_id, _group_id) {
        const userper = Mag_per.getUserPer(user_id)
        let identity_list = (() => {
            if (!_group_id) { return conf_data.identity }
            if (conf_data.data[_group_id].identity.default) { return conf_data.identity }
            return (() => { const { default: t, ...request } = conf_data.data[_group_id].identity; return request })()
        })()
        let output = []
        for (let key in identity_list) {
            if (identity_list[key].includes(user_id) || identity_list[key].includes(userper)) {
                output.push(key)
            }
        }
        return output
    }
    /**
         * 格式化身份消息
         * @param {string} ori 原消息
         * @param {string} _nick 昵称
         * @param {Array} _identity 身份
         * @param {{nick:"nick",content:"content"}} _reply 回复的消息内容
         * @return {string} 返回
     */
    static format_prompt(ori, _nick = "某人", _identity = [], _reply) {
        console.log(_nick, `${_nick || "某人"}${_identity.map(value => "(" + value + ")").join("")}${(_reply && ("回复了" + _reply.nick + "的消息:\"" + _reply.content + "\"")) || ""}对你说:"${ori}"`)
        return `${_nick || "某人"}${_identity.map(value => "(" + value + ")").join("")}${(_reply && ("回复了" + _reply.nick + "的消息:\"" + _reply.content + "\"")) || ""}对你说:"${ori}"`
    }
    static async format_cq(ori) {
        // 收集所有不重复的 qq
        const qqSet = new Set();
        for (const [, qq] of ori.matchAll(/\[CQ:at,qq=(\d+)\]/g)) {
            qqSet.add(qq);
        }

        // 获取所有昵称
        const nickMap = new Map();
        await Promise.all(Array.from(qqSet).map(async (qq) => {
            try {
                const info = await napcat.get_stranger_info({ user_id: qq });
                nickMap.set(qq, info.nick);
            } catch {
                nickMap.set(qq, null); // 标记失败
            }
        }));

        // 同步替换
        return ori.replace(/\[CQ:at,qq=(\d+)\]/g, (match, qq) => {
            return nickMap.get(qq) ?? match; // 如果有昵称就用，否则保留原样
        });
    }
}