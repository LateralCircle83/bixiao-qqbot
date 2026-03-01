import Reg_cmd from "./Command_register.mjs"
import Mag_per from "./Permission_manager.mjs"
import Fast_conf from "./Fast_config.mjs"
const conf =new Fast_conf("Reg_input","reg_input.json")
await conf.setBaseData({})
const conf_data=conf.getAllData()


const reg_Data={}
/**
 * 注册输入检查
 */
class Reg_test{
    /**
     * @param {string} model 空间名
     * @param {number} user_permission  
     * @param {number} group_permission 
     */
    constructor(model,user_permission,group_permission){
        this.model_name=model
        this.discript=""
        this.user_permission=user_permission
        this.group_permission=group_permission
        this.test=(data,user_id,self_id,_group_id,_reply,_at,_message_array,_context)=>false
        this.callback=(data,test_return,user_id,self_id,_group_id,_reply,_at,_message_array,_context)=>false
    }
    /**
     * 设置检测函数，要求函数返回有效数据或false
     * @param {function} f   
     * @returns 
     */
    setTest(f){
        this.test=f
        return this.test
    }
    /**
     * 设置返回函数
     * @param {function} f 
     * @returns 
     */
    setCallback(f){
        this.callback=f
        return this.callback
    }
    /**
     * 设置描述
     * @param {string} dis 
     * @returns 
     */
    setDiscript(dis){
        this.discript=dis
        return this.discript
    }
    /**
     * 载入
     * @returns 
     */
    Loading(){
        reg_Data[this.model_name]={
            "name":this.model_name,
            "discript":this.discript,
            "user_permission":this.user_permission,
            "group_permission":this.group_permission,
            "test":this.test,
            "callback":this.callback
        }
        if(!conf_data[this.model_name]){conf_data[this.model_name]=true;conf.writeKeyData(this.model_name,true)}
        this.distroy()
        return reg_Data
    }
    /**
     * 设置字符串解析是否可用
     * @param {string} name 
     * @param {boolean} state 
     * @returns 
     */
    static magInput(name=null,state){
        if(!name){
            return conf_data
        }
        if(!reg_Data[name]){return false}
        conf_data[name]=state
        conf.writeKeyData(name,state)
        return true
    }
    distroy(){
        this.test=null
        this.callback=null
        this.user_permission=null
        this.group_permission=null
        this.model_name=null
        this.discript=null
    }
    /**
     * 检测并执行
     * @param {string} ori 
     * @param {Array} message_array 
     * @param {number} user_id 
     * @param {number} self_id 
     * @param {number} _group_id 
     * @returns 
     */
    static async testInput(ori,message_array,user_id,self_id,_group_id,_context){
        const request= Reg_cmd.getSpecialMag(ori)
        const userper=Mag_per.getUserPer(user_id)
        const groupper=Mag_per.getGroupPer(_group_id)
        let location=null,test_request=false
        for (let key in reg_Data){
            if(!conf_data[key]) {continue}
            if(reg_Data[key].user_permission>userper||reg_Data[key].group_permission>groupper){continue}
            let test=reg_Data[key].test
            test_request=await test(request.content,user_id,self_id,_group_id,request.reply,request.at,message_array,_context)
            if(test_request){
                location = key
                break
            }
            continue
        }
        if(location===null){return false}
        let callback=reg_Data[location].callback
        await callback(request.content,test_request,user_id,self_id,_group_id,request.reply,request.at,message_array,_context)
        return true
    }
}
export default Reg_test

//列出输入检测
export class List_test {
    static list_all_test(user_id,_group_id){
        const userper=Mag_per.getUserPer(user_id)
        const groupper =(_group_id && Mag_per.getGroupPer(_group_id)) || 0
        let output=["[Reg_test]已注册如下检测\n"]
        for (let key in reg_Data){
            if ((!conf_data[key]) && (userper !== 2)) continue
            if (userper < reg_Data[key].user_permission || groupper < reg_Data[key].group_permission) continue
            output.push(" - \"" + reg_Data[key].name + "\" " + reg_Data[key].discript + "\n")
            continue
        }
        output.push("- tips:输入 [:intest <检测名>] 可以查看检测详情")
        return output.join("")
    }
    static get_test(name,user_id,_group_id){
        const userper = Mag_per.getUserPer(user_id)
        const groupper = (_group_id && Mag_per.getGroupPer(_group_id)) || 0
        if(!reg_Data[name]){return `[Reg_test]"${name}"不是有效名称`}
        let output=["[Reg_test]"]
        if (userper < reg_Data[name].user_permission || groupper < reg_Data[name].group_permission) { return `[Reg_test]不符合权限要求` }
        output.push(`\n名:"${name}"\n描述:${reg_Data[name].discript}\n`)
        if (userper >= reg_Data[name].user_permission) {
            output.push(`permission:[user:${reg_Data[name].user_permission},group:${reg_Data[name].group_permission}]\n`)
        }
        output.push("- tips:全是函数怎么列出来")
        return output.join("")
    }
}