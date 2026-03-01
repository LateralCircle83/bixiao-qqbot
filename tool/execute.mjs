import Reg_cmd from "../basic/Command_register.mjs";
import { Eazy_post } from "../basic/napcat_conntection.mjs";



export function execute(){
    const cmd=new Reg_cmd("tool",":execute",2,0)
    cmd.setDiscript("已指定目标执行命令")
    cmd.setLine([Reg_cmd.choose("as"),Reg_cmd.at("qq"),Reg_cmd.choose("at"),Reg_cmd.text("群"),Reg_cmd.choose("run"),Reg_cmd.text("命令")])
    cmd.setLine([Reg_cmd.choose("as"),Reg_cmd.text("人/this"),Reg_cmd.choose("at"),Reg_cmd.text("群/this/none"),Reg_cmd.choose("run"),Reg_cmd.text("命令")])
    cmd.setCallback(async(data,root,user_id,self_id,_group_id,_reply)=>{
        const user=(data[1]==="this"&&user_id)||data[1]
        const group=(()=>{if(data[3]==="this"){return _group_id};if(data[3]==="none"){return undefined};return data[3]})()
        console.log(data[5],group)
        const request=await Reg_cmd.testInput(((_reply&&`[CQ:reply,id=${_reply}]`)||"")+data[5].replace(/\/\[/g, "_[").replace(/\]\//g, "]_"),user,self_id,group)
        if(!request){
            //await Eazy_post.content("[Tool_execute]不是有效命令",user_id,_group_id)
        }
        return
    })
    cmd.Loading()
}