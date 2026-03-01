import Reg_cmd from "../basic/Command_register.mjs";
import { Eazy_post, napcat, Structs } from "../basic/napcat_conntection.mjs";

export function eval_() {
    const cmd = new Reg_cmd("eval", ":eval", 2, 0)
    cmd.setDiscript("!!!")
    cmd.setLine([Reg_cmd.text("coding")])
    cmd.setCallback(async (data, root, user_id, self_id, _group_id, _reply) => {
        try {
            console.log(data[0])
            if(data[0].includes("process")) return false
            const request =await eval(data[0])
            console.log(String(request))
            await Eazy_post.content(String(request), user_id, _group_id,true)
        } catch (err) {
            await Eazy_post.content(err.toString(),user_id,_group_id)
        }
    })
    cmd.Loading()
}