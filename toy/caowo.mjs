import Reg_cmd from "../basic/Command_register.mjs"
import { Eazy_post } from "../basic/napcat_conntection.mjs"

const cao_data={}
export function cao(){
    const cmd=new Reg_cmd("toy",":cao",0,0)
    cmd.setAlias(":caowo")
    cmd.setDiscript("Van ♂ You SeE")
    cmd.setLine([Reg_cmd.choose("accept","refuse","cancel")])
    cmd.setLine([Reg_cmd.at()],[Reg_cmd.text("使用哪里？")])
    cmd.setLine([Reg_cmd.number("id")],[Reg_cmd.text("使用哪里？")])
    cmd.setLine([])
    cmd.setCallback(async (data,root,user_id,self_id,_group_id)=>{
        let poster=null
        switch(data[0]){
            case "accept":
                for (let key in cao_data){
                    if(cao_data[key].target===user_id){poster=key;break}
                }
                if(poster==null){await Eazy_post.content(`$#@<_at>${user_id}$#@嗷！您这么想被使用么？可惜没人用您呢~~~`,user_id,_group_id);return}
                clearTimeout(cao_data[poster].timer)
                await Eazy_post.content(`$#@<_at>${user_id}$#@啊哈！您接受了$#@<_at>${poster}$#@的使用！您${(cao_data[poster].data&&("的"+cao_data[poster].data))||""}很舒服呢~~~`,user_id,_group_id)
                delete cao_data[poster]
                break
            case "refuse":
                for (let key in cao_data){
                    if(cao_data[key].target===user_id){poster=key;break}
                }
                if(poster==null){await Eazy_post.content(`$#@<_at>${user_id}$#@嗷！您不想被使用么？没人用您呢，放轻松~~~`,user_id,_group_id);return}
                clearTimeout(cao_data[poster].timer)
                await Eazy_post.content(`$#@<_at>${poster}$#@哎，真遗憾，$#@<_at>${user_id}$#@不想被使用呢，您还是另找其人吧~~~`,user_id,_group_id)
                delete cao_data[poster]
                break
            case "cancel":
                if(!cao_data[user_id]){await Eazy_post.content(`$#@<_at>${user_id}$#@什么嘛，没有开始就要取消么？真是一条胆小的杂鱼呢~~~`,user_id,_group_id);return}
                clearTimeout(cao_data[user_id].timer)
                await Eazy_post.content(`$#@<_at>${user_id}$#@怎么有个放长线的姜太公呢？$#@<_at>${cao_data[user_id].target}$#@快来嘲讽他！`,user_id,_group_id)
                delete cao_data[user_id]
                break
            default:
                if(data.length===0){await Eazy_post.content(`$#@<_at>${user_id}$#@~~唔！您用起来好舒服呢~~~`,user_id,_group_id);return}
                if(cao_data[user_id]){await Eazy_post.content(`$#@<_at>${user_id}$#@嗷！您不用$#@<_at>${cao_data[user_id].target}$#@了吗！渣男！`,user_id,_group_id);return}
                for (let key in cao_data){
                    //console.log(key,cao_data[key].target,user_id)
                    if(cao_data[key].target===user_id){await Eazy_post.content(`$#@<_at>${user_id}$#@欸嘿嘿~~~您已经被$#@<_at>${key}$#@选中了哦~~~`,user_id,_group_id);return}
                    if(cao_data[key].target===data[0]){await Eazy_post.content(`$#@<_at>${user_id}$#@嗷呜？$#@<_at>${data[0]}$#@已经被$#@<_at>${key}$#@捷足先登啦~~~下次早点嗷！`,user_id,_group_id);return}
                }
                let p={"target":data[0],"poster":user_id,"timer":null,data:data[1]}
                await Eazy_post.content(`$#@<_at>${data[0]}$#@~~唔！那个.....$#@<_at>${user_id}$#@想要使用您${(data[1]&&("的"+data[1]))||""}呢.....要答应ta么awa\ntips:60s内输入':cao accept|refuse'接受or拒绝`,data[0],_group_id)
                p.timer=setTimeout(async ()=>{
                    delete cao_data[user_id]
                    await Eazy_post.content(`$#@<_at>${user_id}$#@啊！这样吗$#@<_at>${data[0]}$#@好像不理您呐！`,user_id,_group_id)
                },60000)
                cao_data[user_id]=p
        }
        // if(data.length===0) {await Eazy_post.content(`$#@<_at>${user_id}$#@~~唔！您用起来好舒服呢~~~`,user_id,_group_id);return}
        // await Eazy_post.content(`$#@<_at>${data[0]}$#@~~唔！那个.....$#@<_at>${user_id}$#@想要用您呢.....要答应ta么awa`,data[0],_group_id)
    })
    cmd.Loading()
}