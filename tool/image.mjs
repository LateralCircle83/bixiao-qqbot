import Reg_cmd from "../basic/Command_register.mjs";
import Fast_conf from "../basic/Fast_config.mjs";
import { Eazy_post, napcat } from "../basic/napcat_conntection.mjs";



const conf = new Fast_conf("image", "image_list.json")
await conf.setBaseData({})
const conf_data = conf.getAllData()


let temp = { "keyword": ["url"] }
export function image() {
    const cmd = new Reg_cmd("tool", ":image", 2, 0)
    cmd.setAlias(":img")
    cmd.setDiscript("图片管理")
    cmd.setLine([Reg_cmd.choose("list")])
    cmd.setLine([Reg_cmd.choose("get"), Reg_cmd.text("标签")])
    cmd.setLine([Reg_cmd.choose("get_url")])
    cmd.setLine([Reg_cmd.choose("add"), Reg_cmd.text("标签")], [Reg_cmd.text("链接")])
    cmd.setLine([Reg_cmd.choose("del"), Reg_cmd.text("标签"), Reg_cmd.number("目标")])
    cmd.setCallback(async (data, root, user_id, self_id, _group_id, _reply) => {
        let output = ["[Image]"]
        switch (data[0]) {
            case "list":
                output.push("有如下分类:\n")
                for (let key in conf_data) {
                    output.push(" - " + key + " , " + conf_data[key].length + "\n")
                }
                output.push("- tips:关键字,包含的图片数")
                break
            case "get":
                if (!conf_data[data[1]]) {
                    output.push("未找到关键词")
                    return
                }
                await Eazy_post.content_forward(conf_data[data[1]].map(v => `$#@<_image>${v}$#@`), data[1], user_id, _group_id)
                output.push("\"" + data[1] + "\"" + JSON.stringify(conf_data[data[1]], null, 2))
                break
            case "add":
                let image_url = null
                if (_reply) {
                    let respose = await napcat.get_msg({
                        message_id: _reply
                    })
                    for (let i = 0, len = respose.message.length; i < len; i++) {
                        if (respose.message[i].type === "image") {
                            //console.log(respose.message[i].data.file)
                            let file_data = await napcat.get_image({
                                file: respose.message[i].data.file
                            })
                            image_url = file_data.file
                            break
                        }
                    }
                }
                if (!image_url && data[2]) {
                    image_url = data[2]
                }
                if (!image_url) {
                    output.push("木有有效的图片信息")
                    break
                }
                if (!conf_data[data[1]]) {
                    conf_data[data[1]] = [image_url]
                } else {
                    conf_data[data[1]].push(image_url)
                }
                conf.writeAllData(conf_data)
                output.push("已设置图片为标签" + data[1])
                break
            case "del":
                if (!conf_data[data[1]]) {
                    output.push("未找到关键词" + data[1])
                    break
                }
                if (!conf_data[data[1]][data[2]]) {
                    output.push("未找到索引" + data[2])
                    break
                }
                if (conf_data[data[1]].length === 1) {
                    delete conf_data[data[1]]
                } else {
                    conf_data[data[1]].splice(data[2], 1)
                }
                conf.writeAllData(conf_data)
                output.push("已删除索引为" + data[2] + "的图片")
                break
            case "get_url":
                let url=null
                if(!_reply){
                    output.push("看什么好东西呢")
                    break
                }
                let response_1=await napcat.get_msg({
                    message_id:_reply
                })
                for (let i=0,len=response_1.message.length;i<len;i++){
                    if(response_1.message[i].type==="image"){
                        url=response_1.message[i].data.url
                        break
                    }
                }
                if(!url){
                    output.push("啥也木有")
                    break
                }
                output.push(url)
                break
        }
        await Eazy_post.content(output.join(""), user_id, _group_id)
    })
    cmd.Loading()
}
export class Image {
    static format(ori) {
        let data = ori.split("$#@")
        data = data.map(value => {
            if (value.split("<_image>")[1]) {
                if (conf_data[value.split("<_image>")[1]]) {
                    //console.log(getRandomItem(conf_data[value.split("<_image>")[1]]))
                    return `<_image>${getRandomItem(conf_data[value.split("<_image>")[1]])}`
                } else { 
                    return (value.split("<_image>")[1].startsWith("http")&&(value))||(`<_image>${getRandomItem(conf_data["def"])}`) 
                }
            }
            return value
        })
        //console.log(data.join("$#@"))
        return data.join("$#@")
    }
}
const getRandomItem = arr => arr[~~(Math.random() * arr.length)]