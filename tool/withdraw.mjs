import { napcat,Eazy_post } from "../basic/napcat_conntection.mjs";
import Reg_cmd from "../basic/Command_register.mjs";

export function withdraw(){
    const cmd=new Reg_cmd("tool",":withdraw",2,0)
    cmd.setAlias(":recall")
    cmd.setDiscript("撤回消息")
    cmd.setLine([],[])
    cmd.setCallback(async (data,root,user_id,self_id,_group_id,_reply)=>{
        if(!_reply) {await Eazy_post.content(`$#@<_at>${user_id}$#@[Withdraw]不知道到底要撤回什么呢？`,user_id,_group_id);return}
        await napcat.delete_msg({
            message_id:_reply
        })
    })
    cmd.Loading()
}