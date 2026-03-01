import { Eazy_post } from "../basic/napcat_conntection.mjs";
import Reg_notice from "../basic/Notice_register.mjs";


export function welcome() {
    const notice = new Reg_notice("welcome", 0, 0)
    notice.setDescript("入群欢迎")
    notice.setType("group_increase", "group_increase.approve", "group_increase.invite")
    notice.setTest(async (context, type, user_id, self_id, _group_id) => {
        let output=getRandomItem(request)
        output=output.replace(/\$#@<_at>\$#@/g,`$#@<_at>${user_id}$#@`)
        await Eazy_post.content(output, user_id, _group_id)
        return false
    })
    // notice.setCallback(async (context,type,test_return,user_id,self_id,_group_id)=>{
    //     await Eazy_post.content("$#@<_at>"+user_id+"$#@你在戳戳",user_id,_group_id)
    // })
    notice.Loading()
    //notice.setCallback(())
}
const getRandomItem = arr => arr[~~(Math.random() * arr.length)]
const request = [
    "（抱着刚采的野花站在门边，尾巴轻轻摇晃）欢、欢淫$#@<_at>$#@……我编了小小的花环，露珠还在花瓣上打转呢……要戴上试试吗？（踮起脚尖，耳朵害羞地抿了抿）",
    "（从树后探出半个身子，爪尖捏着枫叶）呀！$#@<_at>$#@您来啦……请、请进！我把去年存的松果都擦亮摆在桌子上了……（突然想起什么，慌张地转身）啊！茶要煮过头了——",
    "（蹲在溪边石头上突然抬头，水珠从睫毛滑落）$#@<_at>$#@欢淫……！这些圆石子是我今天挑的，像不像藏着月亮的蛋？（捧起湿漉漉的石子，又低头小声）可以…可以送您一颗最亮的……",
    "（被突然推开的木门声惊得跳起来，尾巴炸成绒球）呜哇！……是、是$#@<_at>$#@呀。（快速理了理衣摆，耳朵发烫）炉火正暖着，我偷偷加了桂花蜜……您闻到甜味了吗？",
    "（踮脚在窗台摆好蒲公英瓶，回头时眼睛亮起来）$#@<_at>$#@您找到这里啦！（小跑到门边又迟疑地放慢脚步）其实…其实我从早上就开始擦星星灯笼了……（轻轻拉住对方袖角）快天黑时它们会像真正的萤火虫那样，一闪一闪的哦。"
]