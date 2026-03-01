import Reg_test from "../basic/Input_register.mjs";
//import Reg_cmd from "../basic/Command_register.mjs";
import { Eazy_post, napcat } from "../basic/napcat_conntection.mjs";
import Fast_conf from "../basic/Fast_config.mjs";
import Reg_cmd from "../basic/Command_register.mjs";
import { Image } from "../tool/image.mjs";


const conf=new Fast_conf("hello","hello_request.json")
await conf.setBaseData({})
const conf_data=conf.getAllData()

const temp={"0$#@aaaa":[],"f12$#@rrr":[]}
export function hello(){
    const input=new Reg_test("hello",0,0)
    input.setDiscript("简单的词组回复")
    input.setTest((data,user_id,self_id,_group_id,_reply,_at)=>{
        //console.log(data)
        for (let key in conf_data){
            //console.log(key)
            if (key[0]==="f") continue
            let long=Infinity,key_word=key.split("$#@")[1]
            // if(key.split("$#@").length!==1) {
            //     long=Number(key.split("$#@")[0].slice(1))
            //     key_word=key.split("$#@")[1]
            // }
            if(key.split("$#@")[0]!=="0"){
                long=Number(key.split("$#@")[0])
            }
            if(data.length>long){
                continue
            }
            if(data.includes(key_word)){
                return key
            }
        }
        return false
    })
    input.setCallback(async (data,key,user_id,self_id,_group_id,_reply,_at,_message_array)=>{
        let output=getRandomItem(conf_data[key]),to_at=user_id
        if(_at&&!_reply){to_at=_at}
        if(_reply){
            let getsender=await napcat.get_msg({
                message_id:_reply
            })
            to_at=getsender.user_id
            //console.log(getsender)
        }
        if(!_at&&!_reply){
            for (let i=0,len=_message_array.length;i<len;i++){
                if(_message_array[i].type==="at"){
                    to_at=_message_array[i].data.qq
                    break
                }
            }
        }
        output=Image.format(output)
        output=output.replace(/\$#@<_at>\$#@/g,`$#@<_at>${to_at}$#@`).replace(/\$#@<_reply>\$#@/g,`${((_reply)&&`$#@<_reply>${_reply}$#@`)||""}`)
        //console.log(output)
        await Eazy_post.content(output,user_id,_group_id)
    })
    input.Loading()

    const cmd=new Reg_cmd("toy",":hello",2,0)
    cmd.setDiscript("词组回复系统")
    cmd.setLine([Reg_cmd.choose("list")])
    cmd.setLine([Reg_cmd.choose("get","off","no"),Reg_cmd.text("关键词")])
    cmd.setLine([Reg_cmd.choose("add"),Reg_cmd.text("关键词"),Reg_cmd.text("回复内容")])
    cmd.setLine([Reg_cmd.choose("del","set_limit"),Reg_cmd.text("关键词"),Reg_cmd.number()])
    cmd.setCallback(async (data,root,user_id,self_id,_group_id,_reply)=>{
        let output=["[Toy_hello]"],point=null
        sw: switch (data[0]){
            case "list":
                output.push("有当前关键词:\n")
                for (let key in conf_data){
                //     if(key.split("$#@")[0]==="0"||key.split("$#@")[0]==="f0"){
                //         output.push(` - ${key.split("$#@")[1]} , ${}\n`)
                //     }else{
                        output.push(` - ${key.split("$#@")[1]} , ${key.split("$#@")[0]}\n`)
                    //}
                }
                output.push("- tips:关键词,限制字数")
                //output=output.join("")
                break
            case "get":
                for (let key in conf_data){
                    if(key.split("$#@")[1]===data[1]){
                        output.push(`"${data[1]}":\n`)
                        output.push(`状态:${(key[0]==="f"&&"关闭")||"开启"}\n`)
                        output.push(`限制字数:${(key[0]==="f"&&key.split("$#@")[0].slice(1))||key.split("$#@")[0]}\n`)
                        output.push("data:"+JSON.stringify(conf_data[key],null,2))
                        break sw
                    }
                }
                output.push(`未找到关键词${data[1]}`)
                break
            case "off":
                for (let key in conf_data){
                    if(key.split("$#@")[1]===data[1]){
                        if(key[0]==="f"){
                            output.push(`关键词"${data[1]}"已关闭`)
                            break sw
                        }
                        conf_data["f"+key]=conf_data[key]
                        delete conf_data[key]
                        conf.writeAllData(conf_data)
                        output.push(`关键词"${data[1]}"已关闭`)
                        break sw
                    }
                }
                output.push(`未找到关键词${data[1]}`)
                break
            case "no":
                for (let key in conf_data){
                    if(key.split("$#@")[1]===data[1]){
                        if(key[0]!=="f"){
                            output.push(`关键词"${data[1]}"已开启`)
                            break sw
                        }
                        conf_data[key.slice(1)]=conf_data[key]
                        delete conf_data[key]
                        conf.writeAllData(conf_data)
                        output.push(`关键词"${data[1]}"已开启`)
                        break sw
                    }
                }
                output.push(`未找到关键词${data[1]}`)
                break
            case "add":
                for (let key in conf_data){
                    if(key.split("$#@")[1]===data[1]){
                        conf_data[key].push(data[2])
                        conf.writeAllData(conf_data)
                        output.push(`找到${data[1]}并加入反馈`)
                        break sw
                    }
                }
                conf_data["0$#@"+data[1]]=[data[2]]
                conf.writeAllData(conf_data)
                output.push(`已创建${data[1]}`)
                break
            case "del":
                for (let key in conf_data){
                    if(key.split("$#@")[1]===data[1]){
                        if(conf_data[key].length===1){
                            delete conf_data[key]
                            conf.writeAllData(conf_data)
                            output.push(`已删除${data[1]}`)
                            break sw
                        }
                        if(!conf_data[key][data[2]]){
                            output.push(`${data[1]}不存在索引${data[2]}`)
                            break sw
                        }
                        conf_data[key].splice(data[2],1)
                        conf.writeAllData(conf_data)
                        output.push(`已删除${data[1]}索引为${data[2]}的反馈`)
                        break sw
                    }
                }
                output.push(`未找到关键词${data[1]}`)
                break
            case "set_limit":
                for (let key in conf_data){
                    if(key.split("$#@")[1]===data[1]){
                        conf_data[`${(key[0]==="f"&&"f")||""+data[2]}$#@${data[1]}`]=conf_data[key]
                        delete conf_data[key]
                        conf.writeAllData(conf_data)
                        output.push(`已设置${data[1]}限制字数为${data[2]}`)
                        break sw
                    }
                }
                output.push(`未找到关键词${data[1]}`)
                break
        }
        await Eazy_post.content(`$#@<_at>${user_id}$#@${output.join("")}`,user_id,_group_id)
    })
    cmd.Loading()
}

const getRandomItem = arr => arr[~~(Math.random() * arr.length)]