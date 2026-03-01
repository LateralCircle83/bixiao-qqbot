import Reg_cmd from "../basic/Command_register.mjs";
import { Eazy_post, napcat, Structs } from "../basic/napcat_conntection.mjs";
import { Image } from "./image.mjs";



export function msg() {
    const cmd = new Reg_cmd("tool", ":message", 1, 0)
    cmd.setAlias(":msg")
    cmd.setDiscript("各种消息工具")
    cmd.setLine([Reg_cmd.choose("post", "repost"), Reg_cmd.text("消息或id")], [Reg_cmd.choose("user", "group"), Reg_cmd.text("id")])
    cmd.setLine([Reg_cmd.choose("get_id","get_file")])
    cmd.setCallback(async (data, root, user_id, self_id, _group_id, _reply) => {
        switch (data[0]) {
            case "post":
                await Eazy_post.content(Image.format(data[1]), (data[2] === "user" && data[3]) || user_id, (data[2] === "group" && data[3]) || _group_id)
                return
            case "repost":
                let repost_request=await napcat.get_msg({
                    message_id:data[1]
                })
                if(repost_request.message[0].type==="record"){
                    await napcat.send_msg({
                        user_id:user_id,
                        group_id:_group_id,
                        message:[Structs.record(repost_request.message[0].data.path)]
                    })
                    return
                }
                switch (data[2]) {
                    case "user":
                        await napcat.forward_friend_single_msg({
                            user_id: data[3],
                            message_id: Number(data[1])
                        })
                        break
                    case "group":
                        await napcat.forward_group_single_msg({
                            group_id: data[3],
                            message_id: Number(data[1])
                        })
                        break
                    default:
                        if (!_group_id) {
                            await napcat.forward_friend_single_msg({
                                user_id: user_id,
                                message_id: Number(data[1])
                            })
                            break
                        }
                        await napcat.forward_group_single_msg({
                            group_id: _group_id,
                            message_id: Number(data[1])
                        })
                        break
                }
                // await napcat.forward_friend_single_msg({
                //     user_id: (data[2] === "user" && data[3]) || user_id,
                //     group_id: (data[2] === "group" && data[3]) || _group_id,
                //     message_id: data[1]
                // })
                return
            case "get_id":
                if (!_reply) {
                    await Eazy_post.content(`[msg_Tool]未知的消息id`, user_id, _group_id)
                    return
                }
                await Eazy_post.content(`[msg_Tool]消息id为:${_reply}`, user_id, _group_id)
                return
            case "get_file":
                if(!_reply){
                    await Eazy_post.content(`[msg_Tool]未知的消息id`, user_id, _group_id)
                    return
                }
                let request=await napcat.get_msg({
                    message_id:_reply
                })
                if(request.message[0].type!=="file"){
                    await Eazy_post.content("[msg_Tool]非文件消息",user_id,_group_id)
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
                await Eazy_post.content(`[msg_Tool]名:${request.message[0].data.file}\nurl:${url}`,user_id,_group_id)
                return
        }
    })
    cmd.Loading()
}