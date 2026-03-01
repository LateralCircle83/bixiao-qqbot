import { napcat,Eazy_post } from "../basic/napcat_conntection.mjs";
import Reg_cmd from "../basic/Command_register.mjs";


export function version(){
    const cmd=new Reg_cmd("tool",":version",0,0)
    cmd.setAlias(":v")
    cmd.setDiscript("版本信息")
    cmd.setLine([],[])
    cmd.setCallback(async (data,root,user_id,self_id,_group_id)=>{
        const request=await napcat.get_version_info()
        await Eazy_post.content(`$#@<_at>${user_id}$#@[Version]版本信息:\n"app_name":${request.app_name}\n"protocol_version":${request.protocol_version}\n"app_version":${request.app_version}`,user_id,_group_id)
    })
    cmd.Loading()
}