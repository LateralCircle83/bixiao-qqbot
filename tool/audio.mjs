import Reg_cmd from "../basic/Command_register.mjs";
import { Eazy_post, napcat, Structs } from "../basic/napcat_conntection.mjs";




export function record(){
    const cmd=new Reg_cmd("tool",":record",0,0)
    cmd.setDiscript("音频转语音")
    cmd.setLine([])
    cmd.setLine([Reg_cmd.text("音频连接")])
    cmd.setCallback(async (data,root,user_id,self_id,_group_id,_reply)=>{
        if(!data[0]&&!_reply){
            await Eazy_post.content("[Record]啥也木有",user_id,_group_id)
            return
        }
        if(data[0]){
            await napcat.send_msg({
                user_id:user_id,
                group_id:_group_id,
                message:[Structs.record(data[0])]
            })
            return
        }
        if(_reply){
            let request=await napcat.get_msg({
                message_id:_reply
            })
            if(request.message[0].type!=="file"&&!/\.(mp3|wav|ogg|aac|flac|m4a|wma|opus|aiff|amr|mid|midi|mp2|m4b|m4p|ape|ra|rm|au|snd|pcm|weba|3ga)$/i.test(request.message[0].data.file)) {
                await Eazy_post.content("[Record]不是合理文件",user_id,_group_id)
                return
            }
            let url=request.message[0].data.url
                if(!url){
                    if(_group_id){
                        url=await napcat.get_group_file_url({
                            file_id:request.message[0].data.file_id
                        })
                    }else{
                        url=await napcat.get_private_file_url({
                            file_id:request.message[0].data.file_id
                        })
                    }
                    url=url.url
                }
            await napcat.send_msg({
                user_id:user_id,
                group_id:_group_id,
                message:[Structs.record(url)]
            })
            return
        }
    })
    cmd.Loading()
}