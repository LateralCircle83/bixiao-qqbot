import Mag_per from "./Permission_manager.mjs";
import { Eazy_post } from "./napcat_conntection.mjs";
import Fast_conf from "./Fast_config.mjs";
const conf = new Fast_conf("Reg_cmd", "reg_command.json")
await conf.setBaseData({})
const conf_data = conf.getAllData()


const command = {}
/**
 * 命令注册器
 */
class Reg_cmd {
    /**
     * 注册命令
     * @param {string} model 模块名
     * @param {string} rootcmd 根命令
     * @param {number} user_permission 个人权限
     * @param {number} group_permission 群权限
     */
    constructor(model, rootcmd, user_permission, group_permission) {
        this.model_name = model
        this.root_cmd = rootcmd
        this.user_permission = user_permission
        this.group_permission = group_permission
        this.line = []
        this.discript = ""
        this.Alias
        /**
         * callback
         * @param {Array} data 返回列
         * @param {string} root 根命令
         * @param {number} user_id 数字
         * @param {number} self_id 自己的id
         * @param {number} _group_id 数字
         * @param {number} _reply 回复的消息id
         */
        this.callback = (data, root, user_id, self_id, _group_id, _reply,_context) => { console.log(data, root, user_id, self_id, _group_id, _reply,_context) }
    }
    /**
     * 设置命令重载
     * @param {Array} key_param 必须参数
     * @param {Array} opt_param 可选参数
     * @returns 
     */
    setLine(key_param, opt_param = []) {
        this.line.push([key_param, opt_param])
        return this.line
    }
    /**
     * 设置命令描述
     * @param {string} dis 描述
     * @returns 
     */
    setDiscript(dis) {
        this.discript = dis
        return this.discript
    }
    /**
     * 设置命令别名
     * @param {string} ali 别名
     * @returns 
     */
    setAlias(ali) {
        this.Alias = ali
        return this.Alias
    }
    /**
     * 设置回调函数
     * @param {function} f 函数([列],根命令,人,群)
     * @returns 
     */
    setCallback(f) {
        this.callback = f
        return this.callback
    }
    /**
     * 完成，加载
     * @returns 
     */
    Loading() {
        command[this.root_cmd] = {
            "model": this.model_name,
            "root": this.root_cmd,
            "user_permission": this.user_permission,
            "group_permission": this.group_permission,
            "discript": this.discript,
            "callback": this.callback,
            "alias": this.Alias,
            "line": this.line
        }
        if (this.Alias) {
            command[this.Alias] = this.root_cmd
        }
        //console.log(conf_data[this.root_cmd])
        if (!conf_data[this.root_cmd]) { conf_data[this.root_cmd] = true; conf.writeKeyData(this.root_cmd, true) }
        this.distroy()
        return command[this.root_cmd]
    }
    //垃圾清理
    distroy() {
        this.cache = null
        this.cacheTime = null
        this.root_cmd = null
        this.user_permission = null
        this.group_permission = null
        this.line = null
        this.discript = null
        this.Alias = null
        this.callback = null
    }
    static text(_discript) {
        return (_discript&&`<str>___${_discript}`)||"<str>"
    }
    static number(_discript) {
        return (_discript&&`<num>___${_discript}`)||"<num>"
    }
    static at(_discript) {
        return (_discript&&`<at>___${_discript}`)||"<at>"
    }
    static choose(...arr) {
        return `@${arr.join(",")}`
    }
    /**
     * 检查命令并执行
     * @param {string} ori input
     * @param {number} user_id qq号
     * @param {number} self_id 自己的qq
     * @param {number} _group_id 群号
     */
    static async testInput(ori, user_id, self_id, _group_id,_context) {
        const request = Reg_cmd.getSpecialMag(ori)
        if (request.at && request.at !== self_id) return false
        let token = request.content.trim().split(/\s+/), data, _token = []
        if (token.length === 0 || !command[token[0]]) {
            return false
        }
        if (typeof command[token[0]] === "string") {
            data = command[command[token[0]]]
        } else {
            data = command[token[0]]
        }
        //是否为关闭状态
        if (!conf_data[data.root]) { return false }
        //测试权限
        //console.log(Mag_per.getUserPer(user_id))
        if (data.user_permission > Mag_per.getUserPer(user_id)) {
            await Reg_cmd.outErr(data.root, "", "permission", user_id, null, _group_id)
            return false
        }
        if (_group_id) {
            if (data.group_permission > Mag_per.getGroupPer(_group_id)) {
                return false
            }
        }
        //还原带空格的字符串
        for (let i = 1, len = token.length, p = false, k = ""; i < len; i++) {
            if (token[i] === "_[") {
                p = true
                continue
            }
            if (token[i] === "]_") {
                p = false
                _token.push(k.substring(1))
                continue
            }
            if (p) {
                k += ` ${token[i]}`
                continue
            }
            _token.push(token[i])
            continue
        }
        token = _token; _token = null

        //查找所有可能的列
        let maybe = [...Array(data.line.length).keys()], findlist = []
        data.line.forEach((item) => {// 构建索引
            findlist.push(item.flat())
        })
        for (let i = 0, len = token.length; i < len; i++) {
            //console.log("现在检查：",token[i])
            //console.log(maybe)
            if (maybe.length == 1) { break }
            findlist.forEach((item, index) => {
                //console.log(item)
                if (!maybe.includes(index)) { return }
                if (!item[i]) { return }
                //console.log("",item[i])
                //测试choose
                if (item[i][0] === "@") {
                    if (item[i].includes(token[i])) { } else { if (maybe.length > 1) maybe = maybe.filter(_item => _item !== index) }
                    return
                }
                //console.log(item[i])
                if (item[i].split("___")[0] === "<str>") {
                    return
                }
                if (item[i].split("___")[0] === "<num>") {
                    if (/^[-+]?(\d+(\.\d*)?|\.\d+)$/.test(token[i])) { } else { if (maybe.length > 1) maybe = maybe.filter(_item => _item !== index) }
                    return
                }
                if (item[i].split("___")[0] === "<at>") {
                    if (token[i].match(/\[CQ:at,qq=([^\]]+)\]/)) { } else { if (maybe.length > 1) maybe = maybe.filter(_item => _item !== index) }
                    return
                }
            })
        }
        //console.log(maybe)
        //findlist=null
        //如果还有多个可能，取长度比较
        if (maybe.length > 1) {
            //console.log(JSON.stringify(findlist))
            findlist = maybe.map(index => findlist[index])
            //console.log(findlist,token.length)
            let current_min = Infinity, current_index = []
            for (let i = 0, len = findlist.length; i < len; i++) {
                const abs = Math.abs(token.length - findlist[i].length)
                if (abs < current_min) {
                    current_min = abs
                    current_index = [i]
                    continue
                }
                if (abs > current_min) { continue }
                if (abs === current_min) {
                    current_index.push(i)
                    continue
                }
            }
            //console.log(current_min)
            // if (current_index.length !== 1) {
            //      maybe = maybe[getRandom(current_index)]
            // } else {
            //     maybe = maybe[current_index[0]]
            // }
            maybe = maybe[current_index[0]]
        } else { maybe = maybe[0] }
        findlist = null

        console.log("最终结果", maybe)

        //正式解析命令
        //必选参数
        let line = data.line[maybe]
        for (let i = 0, len = line[0].length; i < len; i++) {
            if (!token[i]) {
                await Reg_cmd.outErr(data.root, `${request.content} >>>underfind<<<`, "underfind_param", user_id, line, _group_id)
                return false
            }
            if (line[0][i][0] === "@") {
                let list = line[0][i].substring(1).split(",")
                if (list.includes(token[i])) {
                    continue
                } else {
                    token[i] = `>>>${token[i]}<<<`
                    await Reg_cmd.outErr(data.root, `${data.root} ${token.join(" ")}`, "wrong_param", user_id, line, _group_id)
                    return false
                }
            }
            if (line[0][i].split("___")[0] === "<str>") {
                continue
            }
            if (line[0][i].split("___")[0] === "<num>") {
                if (/^[-+]?(\d+(\.\d*)?|\.\d+)$/.test(token[i])) {
                    token[i] = Number(token[i])
                    continue
                } else {
                    token[i] = `>>>${token[i]}<<<`
                    await Reg_cmd.outErr(data.root, `${data.root} ${token.join(" ")}`, "wrong_type", user_id, line, _group_id)
                    return false
                }
            }
            if (line[0][i].split("___")[0] === "<at>") {
                if (token[i].match(/\[CQ:at,qq=([^\]]+)\]/)) {
                    token[i] = Number(token[i].match(/\[CQ:at,qq=([^\]]+)\]/)[1].trim())
                    continue
                } else {
                    token[i] = `>>>${token[i]}<<<`
                    await Reg_cmd.outErr(data.root, `${data.root} ${token.join(" ")}`, "wrong_type", user_id, line, _group_id)
                    return false
                }
            }
        }
        //可选参数
        if (token.length > line[0].length) {
            if (line[1].length !== 0) {
                for (let i = 0, len = line[1].length, index = line[0].length; i < len; i++) {
                    if (line[1][i][0] === "@") {
                        let list = line[1][i].substring(1).split(",")
                        if (list.includes(token[i + index])) {
                            continue
                        } else {
                            token[i + index] = `>>>${token[i + index]}<<<`
                            await Reg_cmd.outErr(data.root, `${data.root} ${token.join(" ")}`, "wrong_param", user_id, line, _group_id)
                            return false
                        }
                    }
                    if (line[1][i].split("___")[0] === "<str>") {
                        continue
                    }
                    if (line[1][i].split("___")[0] === "<num>") {
                        if (/^[-+]?(\d+(\.\d*)?|\.\d+)$/.test(token[i + index])) {
                            token[i + index] = Number(token[i + index])
                            continue
                        } else {
                            token[i + index] = `>>>${token[i + index]}<<<`
                            await Reg_cmd.outErr(data.root, `${data.root} ${token.join(" ")}`, "wrong_type", user_id, line, _group_id)
                            return false
                        }
                    }
                    if (line[1][i].split("___")[0] === "<at>") {
                        if (token[i + index].match(/\[CQ:at,qq=([^\]]+)\]/)) {
                            token[i + index] = Number(token[i + index].match(/\[CQ:at,qq=([^\]]+)\]/)[1].trim())
                            continue
                        } else {
                            token[i + index] = `>>>${token[i + index]}<<<`
                            await Reg_cmd.outErr(data.root, `${data.root} ${token.join(" ")}`, "wrong_type", user_id, line, _group_id)
                            return false
                        }
                    }
                }
                if (line.flat().length < token.length) {
                    await Reg_cmd.outErr(data.root, `${data.root} ${token.slice(0, line.flat().length).join(" ")} >>>${token.slice(line.flat().length, token.length).join(" ")}<<<`, "extra_param", user_id, line, _group_id)
                    return false
                }
            } else {
                await Reg_cmd.outErr(data.root, `${data.root} ${token.slice(0, line[0].length).join(" ")} >>>${token.slice(line[0].length, token.length).join(" ")}<<<`, "extra_param", user_id, line, _group_id)
                return false
            }
        }
        let call_back = data.callback
        await call_back(token, data.root, user_id, self_id, _group_id, request.reply,_context)
        return true
    }
    /**
     * 抛出错误
     * @param {string} rootcmd 根命令
     * @param {string} wrong_data 具体错误位置
     * @param {string} wrong_type 错误码
     * @param {Array} _t 原命令模板
     */
    static async outErr(rootcmd, wrong_data, wrong_type, user_id, _t, group_id) {
        let output
        switch (wrong_type) {
            case "underfind_param":
                output = "[Underfind_param]空的参数位于:\"" + wrong_data + "\"\n可能为:\"" + rootcmd + " " + _t.flat().join(" ") + "\""
                break
            case "wrong_param":
                output = "[Wrong_param]错误的参数位于:\"" + wrong_data + "\"\n可能为:\"" + rootcmd + " " + _t.flat().join(" ") + "\""
                break
            case "wrong_type":
                output = "[Wrong_type]错误的类型位于:\"" + wrong_data + "\"\n可能为:\"" + rootcmd + " " + _t.flat().join(" ") + "\""
                break
            case "extra_param":
                output = "[Extra_param]意外的参数位于:\"" + wrong_data + "\"\n可能为:\"" + rootcmd + " " + _t.flat().join(" ") + "\""
                break
            case "permission":
                output = "[Bad_permission]不符合此命令权限要求"
                break
        }
        console.log(output)
        await Eazy_post.content(`$#@<_at>${user_id}$#@${output}`, user_id, group_id)
    }
    // static getAllCmd() {
    //     return command
    // }
    /**
     * 设置命令是否可用
     * @param {string} cmd 
     * @param {boolean} state 
     */
    static magCmd(cmd = null, state) {
        if (!cmd) {
            return conf_data
        }
        if (!command[cmd]) return false
        let _cmd = cmd
        if (typeof command[cmd] === "string") _cmd = command[cmd]
        conf_data[_cmd] = state
        conf.writeKeyData(cmd, state)
        return true
    }
    /**
     * 获取特殊消息类型{reply,at}
     * @param {string} text 
     * @returns {{reply:number,at:number,content:text}}
     */
    static getSpecialMag(text) {
        const output = { reply: null, at: null, content: text }
        const getnear = str => str.includes(']') ? str.slice(0, str.indexOf(']') + 1) : str
        const getfar = str => str.includes(']') ? str.slice(str.indexOf(']') + 1, str.length) : str
        let _data = getnear(text).trim()
        if (_data[0] !== "[") {
            return output
        }
        let temp_a = _data.match(/\[CQ:reply,id=(\d+)\]/)
        if (temp_a) {
            output.reply = Number(temp_a[1])
            output.content = getfar(text).trim()
        } else {
            temp_a = _data.match(/\[CQ:at,qq=(\d+)\]/)
            if (temp_a) {
                output.at = Number(temp_a[1])
            } else {
                return output
            }
            output.content = getfar(text).trim()
            return output
        }

        //output.content = getfar(text).trim()
        _data = getnear(getfar(text)).trim()
        if (_data[0] !== "[") {
            return output
        }
        temp_a = _data.match(/\[CQ:at,qq=(\d+)\]/)
        if (temp_a) {
            output.at = Number(temp_a[1])
        } else {
            return output
        }
        output.content = getfar(output.content).trim()
        return output
    }
}

export default Reg_cmd


//help命令的规范输出
export class List_cmd {
    /**
     * 获取全部根命令
     * @param {number} user_id 
     * @param {number} _group_id 
     * @returns {string}
     */
    static list_all_cmd(user_id, _group_id) {
        const userper = Mag_per.getUserPer(user_id)
        const groupper = (_group_id && Mag_per.getGroupPer(_group_id)) || 0
        let output = ["[Reg_cmd]已注册如下命令:\n"]
        for (let key in command) {
            if (typeof command[key] === "string") continue
            if ((!conf_data[key]) && (userper !== 2)) continue
            if (userper < command[key].user_permission || groupper < command[key].group_permission) continue
            output.push(" - \"" + command[key].root + "\" " + command[key].discript + "\n")
            continue
        }
        output.push("- tips:输入 [:help <根命令名>] 可以查看命令详情\n_[ 可已围住带空格的部分 ]_")
        return output.join("")
    }
    /**
     * 获取单个命令
     * @param {string} cmd_ 根命令
     * @param {number} user_id 
     * @param {number} _group_id 
     * @returns {string}
     */
    static get_cmd(cmd_, user_id, _group_id) {
        const userper = Mag_per.getUserPer(user_id)
        const groupper = (_group_id && Mag_per.getGroupPer(_group_id)) || 0
        if (!command[cmd_]) { return `[Reg_cmd]"${cmd_}"不是有效命令` }
        let _cmd = cmd_, output = ["[Reg_cmd]"]
        if (typeof command[cmd_] === "string") { _cmd = command[cmd_] }
        if (userper < command[_cmd].user_permission || groupper < command[_cmd].group_permission) { return `[Reg_cmd]不符合权限要求` }
        output.push(`"${_cmd}"\n描述:${command[_cmd].discript}\n`)
        if (command[_cmd].alias) { output.push("别名:\"" + command[_cmd].alias + "\"\n") }
        if (userper >= command[_cmd].user_permission) {
            output.push(`permission:[user:${command[_cmd].user_permission},group:${command[_cmd].group_permission}]\n`)
        }
        output.push("详细参数:\n")
        for (let i = 0, len = command[_cmd].line.length; i < len; i++) {
            output.push(" - " + _cmd + " " + command[_cmd].line[i][0].join(" ") + ` [ ${command[_cmd].line[i][1].join(" ") || "None"} ]\n`)
        }
        output.push("- tips:[]中为可选参数,@后为选项参数")
        return output.join("").replace(/___/g, "")
    }
}