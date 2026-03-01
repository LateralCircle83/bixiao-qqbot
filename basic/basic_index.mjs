import Reg_cmd,{ List_cmd } from "./Command_register.mjs";
import Reg_test, { List_test } from "./Input_register.mjs";
import Reg_notice, { List_notice } from "./Notice_register.mjs";
import Mag_per from "./Permission_manager.mjs";
import { Eazy_post } from "./napcat_conntection.mjs";

//基础模块索引run
permission_manager()
cmd_help()
max_context()
cmd_manager()
input_help()
input_manager()
notice_help()
notice_manager()



//权限管理
function permission_manager() {
    const cmd = new Reg_cmd("mag_per", ":permission", 2, 0)
    cmd.setDiscript("权限管理器")
    cmd.setAlias(":per")
    cmd.setLine([Reg_cmd.choose("get"), Reg_cmd.choose("user"), Reg_cmd.at()], [])
    cmd.setLine([Reg_cmd.choose("get"), Reg_cmd.choose("user", "group"), Reg_cmd.text()])
    cmd.setLine([Reg_cmd.choose("set"), Reg_cmd.choose("user"), Reg_cmd.at(), Reg_cmd.number()])
    cmd.setLine([Reg_cmd.choose("set"), Reg_cmd.choose("user", "group"), Reg_cmd.text(), Reg_cmd.number()])
    cmd.setCallback(async (data, root, user_id, self_id, _group_id) => {
        if (data[0] === "get") {
            if (data[1] === "user") {
                await Eazy_post.content(`$#@<_at>${user_id}$#@[Permission]user:"${data[2]}"的权限为: ${Mag_per.getUserPer(data[2])}`, user_id, _group_id)
                return
            }
            if (data[1] === "group") {
                const group=(data[2]==="this"&&_group_id)||data[2]
                await Eazy_post.content(`$#@<_at>${user_id}$#@[Permission]group:"${group}"的权限为: ${Mag_per.getGroupPer(group)}`, user_id, _group_id)
                return
            }
        }
        if (data[0] === "set") {
            if (data[1] === "user") {
                let ori = Mag_per.getUserPer(data[2])
                await Mag_per.setUserPer(data[2], data[3])
                await Eazy_post.content(`$#@<_at>${user_id}$#@[Permission]已设置user:"${data[2]}"的权限从: ${ori} 到: ${Mag_per.getUserPer(data[2])}`, user_id, _group_id)
                return
            }
            if (data[1] === "group") {
                const group=(data[2]==="this"&&_group_id)||data[2]
                let ori = Mag_per.getGroupPer(group)
                await Mag_per.setGroupPer(group, data[3])
                await Eazy_post.content(`$#@<_at>${user_id}$#@[Permission]已设置group:"${group}"的权限从: ${ori} 到: ${Mag_per.getGroupPer(group)}`, user_id, _group_id)
                return
            }
        }
    })
    cmd.Loading()
}
//help命令
function cmd_help() {
    const cmd = new Reg_cmd("Reg_cmd", ":help", 0, 0)
    cmd.setAlias(":?")
    cmd.setDiscript("命令帮助")
    cmd.setLine([Reg_cmd.text()], [])
    cmd.setLine([], [])
    cmd.setCallback(async (data, root, user_id, self_id, _group_id) => {
        if (data.length === 0) {
            //console.log(List_cmd.list_all_cmd(user_id,_group_id))
            await Eazy_post.content(`$#@<_at>${user_id}$#@${List_cmd.list_all_cmd(user_id, _group_id)}`, user_id, _group_id)
        } else {
            //console.log(List_cmd.get_cmd(data[0],user_id,_group_id))
            await Eazy_post.content(`$#@<_at>${user_id}$#@${List_cmd.get_cmd(data[0], user_id, _group_id)}`, user_id, _group_id)
        }
    })
    cmd.Loading()
}
//最长输出字符设置
function max_context() {
    const cmd = new Reg_cmd("napcat", ":maxtext", 2, 0)
    cmd.setLine([Reg_cmd.number()], [])
    cmd.setDiscript("最长字符串输出长度")
    cmd.setCallback(async (data, root, user_id, self_id, _group_id) => {
        await Eazy_post.set_max_context(data[0])
        await Eazy_post.content(`$#@<_at>${user_id}$#@[Content]输出长度已设置为${data[0]}`, user_id, _group_id)
    })
    cmd.Loading()
}
//命令管理
function cmd_manager() {
    const cmd = new Reg_cmd("Reg_cmd", ":command", 2, 0)
    cmd.setLine([Reg_cmd.text(), Reg_cmd.choose("true", "false")])
    cmd.setLine([Reg_cmd.choose("list")])
    cmd.setDiscript("管理命令")
    cmd.setCallback(async (data, root, user_id, self_id, _group_id) => {
        if (data[0] === "list") {
            await Eazy_post.content(`$#@<_at>${user_id}$#@[Reg_cmd]${JSON.stringify(Reg_cmd.magCmd(null, true), null, 2)}`, user_id, _group_id)
            return
        }
        const state = Reg_cmd.magCmd(data[0], ((data[1] === "true" && true) || false))
        if (!state) { await Eazy_post.content(`$#@<_at>${user_id}$#@[Reg_cmd]"${data[0]}"不能识别为命令`, user_id, _group_id); return }
        await Eazy_post.content(`$#@<_at>${user_id}$#@[Reg_cmd]"${data[0]}"已标记为${data[1]}`, user_id, _group_id)
    })
    cmd.Loading()
}
//列出输入检测
function input_help() {
    const cmd = new Reg_cmd("Reg_test", ":heinput", 0, 0)
    cmd.setDiscript("输入检测帮助")
    cmd.setAlias(":hi")
    cmd.setLine([Reg_cmd.text()], [])
    cmd.setLine([], [])
    cmd.setCallback(async (data, root, user_id, self_id, _group_id, _reply) => {
        if (data.length === 0) {
            await Eazy_post.content(`$#@<_at>${user_id}$#@${List_test.list_all_test(user_id, _group_id)}`, user_id, _group_id)
        } else {
            await Eazy_post.content(`$#@<_at>${user_id}$#@${List_test.get_test(data[0], user_id, _group_id)}`, user_id, _group_id)
        }
    })
    cmd.Loading()
}
//输入检测管理
function input_manager() {
    const cmd = new Reg_cmd("Reg_test", ":input", 2, 0)
    cmd.setLine([Reg_cmd.text(), Reg_cmd.choose("true", "false")])
    cmd.setLine([Reg_cmd.choose("list")])
    cmd.setDiscript("管理输入检测")
    cmd.setCallback(async (data, root, user_id, self_id, _group_id) => {
        if (data[0] === "list") {
            await Eazy_post.content(`$#@<_at>${user_id}$#@[Reg_test]${JSON.stringify(Reg_test.magInput(null, true), null, 2)}`, user_id, _group_id)
            return
        }
        const state = Reg_test.magInput(data[0], ((data[1] === "true" && true) || false))
        if (!state) { await Eazy_post.content(`$#@<_at>${user_id}$#@[Reg_test]"${data[0]}"不能识别为名称`, user_id, _group_id); return }
        await Eazy_post.content(`$#@<_at>${user_id}$#@[Reg_test]"${data[0]}"已标记为${data[1]}`, user_id, _group_id)
    })
    cmd.Loading()
}
//列出notice检测
function notice_help(){
    const cmd=new Reg_cmd("Reg_notice",":henotice",0,0)
    cmd.setDiscript("notice检测帮助")
    cmd.setAlias(":hn")
    cmd.setLine([Reg_cmd.text()], [])
    cmd.setLine([], [])
    cmd.setCallback(async (data, root, user_id, self_id, _group_id, _reply) => {
        if (data.length === 0) {
            await Eazy_post.content(`$#@<_at>${user_id}$#@${List_notice.list_all_notice(user_id, _group_id)}`, user_id, _group_id)
        } else {
            await Eazy_post.content(`$#@<_at>${user_id}$#@${List_notice.get_notice(data[0], user_id, _group_id)}`, user_id, _group_id)
        }
    })
    cmd.Loading()
}
//notice检测管理
function notice_manager(){
    const cmd = new Reg_cmd("Reg_notice", ":notice", 2, 0)
    cmd.setLine([Reg_cmd.text(), Reg_cmd.choose("true", "false")])
    cmd.setLine([Reg_cmd.choose("list")])
    cmd.setDiscript("管理notice检测")
    cmd.setCallback(async (data, root, user_id, self_id, _group_id) => {
        if (data[0] === "list") {
            await Eazy_post.content(`$#@<_at>${user_id}$#@[Reg_notice]${JSON.stringify(Reg_notice.magNotice(null, true), null, 2)}`, user_id, _group_id)
            return
        }
        const state = Reg_notice.magNotice(data[0], ((data[1] === "true" && true) || false))
        if (!state) { await Eazy_post.content(`$#@<_at>${user_id}$#@[Reg_notice]"${data[0]}"不能识别为名称`, user_id, _group_id); return }
        await Eazy_post.content(`$#@<_at>${user_id}$#@[Reg_notice]"${data[0]}"已标记为${data[1]}`, user_id, _group_id)
    })
    cmd.Loading()
}