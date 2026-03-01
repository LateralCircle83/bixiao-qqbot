//napcat连接器
console.log(process.cwd())
import Fast_conf from "./Fast_config.mjs"
import { NCWebsocket, Structs } from "node-napcat-ts"


const conf = new Fast_conf("napcatweb")
await conf.setBaseData({
    "baseUrl": "space",
    "accessToken": "space",
    "context_long": 500
}, true)
var conf_data = conf.getAllData()
conf.clearCache()



//定义链接
const napcat = new NCWebsocket({
    baseUrl: conf_data.baseUrl,
    accessToken: conf_data.accessToken,
    // 是否需要在触发 socket.error 时抛出错误, 默认关闭
    throwPromise: true,
    // ↓ 自动重连(可选)
    reconnection: {
        enable: true,
        attempts: 10,
        delay: 5000
    }
    // ↓ 是否开启 DEBUG 模式
}, false)


//简易发送消息
class Eazy_post {
    temp = ["$#@<_reply>12345$#@","$#@<_at>12345678$#@","$#@<_image>http://???????$#@"]
    /**
     * 快速发送文本$#@<at>12345678$#@消息,
     * @param {string} text 
     * @param {number} user_id 
     * @param {number} _group_id 
     */
    static async content(text, user_id, _group_id,_isUnformat) {
        //找到@
        //console.log(text)
        let arr = Eazy_post.split_long(text)
        //console.log(JSON.stringify(Eazy_post.set_at_list_data(arr)[0]))
        if (arr.length !== 1 || arr[0].replace(/\$#@[\s\S]*?\$#@/g, '').length >= conf_data.context_long) {
            await Eazy_post.content_forward(arr, "长信息拆分", user_id, _group_id,_isUnformat)
            return
        }
        try {
            await napcat.send_msg({
                user_id: user_id,
                group_id: _group_id,
                message: (_isUnformat&&[Structs.text(arr[0])])||Eazy_post.format_data(arr)[0]
            })
            return true
        } catch (err) {
            console.log(err)
            return false
        }
    }
    /**
     * 快速发送合并转发消息
     * @param {Array} arr 
     * @param {string} nick 
     * @param {number} user_id 
     * @param {number} _group_id 
     */
    static async content_forward(arr, nick, user_id, _group_id,_isUnformat) {
        function get_forward(c, n) {
            return {
                "type": "node",
                "data": {
                    "nickname": n,
                    "content": c
                }
            }
        }
        let _arr = (_isUnformat&&arr.map(value=>[Structs.text(value)]))||Eazy_post.format_data(arr)
        console.log(_arr)
        try {
            await napcat.send_forward_msg({
                user_id: user_id,
                group_id: _group_id,
                message: _arr.map(value => get_forward(value, nick))
            })
            return true
        } catch (err) {
            console.log(err)
            return false
        }
    }
    /**
     * 按照字数限制切片
     * @param {string} text 
     * @returns {Array}
     */
    static split_long(text) {
        //console.log(text)
        return text.match(new RegExp(`[\\s\\S]{1,3420}`, 'g')) || []
    }
    /**
     * 格式化message还原@
     * @param {Array} text 
     * @returns {Array}
     */
    static format_data(text) {
        let _text = text
        if (typeof text === "string") { _text = [text] }
        for (let i = 0, len = _text.length; i < len; i++) {
            let arr = _text[i].split("$#@")
            _text[i] = arr.map(value => {
                if (value.split("<_at>")[1]) {
                    return Structs.at(Number(value.split("<_at>")[1]))
                }
                if (value.split("<_reply>")[1]){
                    return Structs.reply(Number(value.split("<_reply>")[1]))
                }
                if (value.split("<_image>")[1]){
                    return Structs.image(value.split("<_image>")[1],"狐爱你们💕❤️.jpg")
                }
                return Structs.text(value)
            })
        }
        //console.log(_text)
        return _text
    }
    static async set_max_context(num) {
        conf.writeKeyData("context_long", num)
        conf_data = conf.getAllData()
        return
    }
}

//链接
await napcat.connect()

export { napcat, Structs, Eazy_post }