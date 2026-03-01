import "./basic/basic_index.mjs"
import "./toy/toy_index.mjs"
import "./tool/tool_index.mjs"
import { napcat } from "./basic/napcat_conntection.mjs";
import Reg_cmd from "./basic/Command_register.mjs";
import Reg_test from "./basic/Input_register.mjs";
import Reg_notice from "./basic/Notice_register.mjs";
import "./ollama/ollama.mjs"
import { Ai_chat } from "./ollama/ollama.mjs";


//接收消息
napcat.on("message", async (context) => {
    //[CQ:reply,id=435037067][CQ:at,qq=2022153097] 6
    //if(context.user_id===1465287608) console.log(JSON.stringify(context,null,2))
    const isCommand = await Reg_cmd.testInput(context.raw_message, context.user_id, context.self_id, context.group_id,context)
    //console.log("是否为命令:",isCommand)
    if (isCommand) return
    const isInputest = await Reg_test.testInput(context.raw_message, context.message, context.user_id, context.self_id, context.group_id,context)
    //console.log("是否可检测:",isInputest)
    if (isInputest) return
    const isAiChat=await Ai_chat.test_ai(context,context.user_id,context.self_id,context.group_id)
    console.log(isAiChat)
})
//接收notice
napcat.on("notice", async (context) => {
    //console.log(JSON.stringify(context, null, 2))
    const isNotice = await Reg_notice.testnotice(context, `${context.notice_type}${(context.sub_type&&("."+context.sub_type)) || ""}`, context.user_id, context.self_id, context.group_id)
    if (isNotice) return
})
//收取自己消息
napcat.on("message_sent",async (context)=>{
    //console.log(JSON.stringify(context,null,2))
    const isCommand = await Reg_cmd.testInput(context.raw_message, context.user_id, context.self_id, context.group_id,context)
    //console.log("是否为命令:",isCommand)
    if (isCommand) return
})


process.on('unhandledRejection', (reason, promise) => {
    console.error('未处理的 Promise 拒绝:', reason);
})
