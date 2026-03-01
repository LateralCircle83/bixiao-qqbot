import Fast_conf from "./Fast_config.mjs"
import Mag_per from "./Permission_manager.mjs"

const conf=new Fast_conf("Reg_notice","reg_notice.json")
await conf.setBaseData({})
const conf_data=conf.getAllData()


const reg_Data={}
/**
   notice信息监听注册器
*/
class Reg_notice {
    /**
     * 
     * @param {string} model 
     * @param {number} user_permission 
     * @param {number} group_permission 
     */
    constructor(model,user_permission,group_permission){
        this.model_name=model
        this.user_permission=user_permission
        this.group_permission=group_permission
        this.discript=""
        this.type=[]
        this.test=(context,type,user_id,self_id,_group_id)=>false
        this.callback=(context,type,test_return,user_id,self_id,_group_id)=>false
    }
    /**
     * 设置描述
     * @param {string} dis 
     * @returns 
     */
    setDescript(dis){
        this.discript=dis
        return this.discript
    }
    /**
     * 设置监听类型
     * @param  {...any} arr 
     * @returns 
     */
    setType(...arr){
        this.type=arr
        return this.type
    }
    /**
     * 设置测试函数
     * @param {function} f 
     * @returns 
     */
    setTest(f){
        this.test=f
        return this.test
    }
    /**设置回调函数
     * 
     * @param {*} f 
     * @returns 
     */
    setCallback(f){
        this.callback=f
        return this.callback
    }
    /**
     * 垃圾清理
     */
    distroy(){
        this.model_name=null
        this.user_permission=null
        this.group_permission=null
        this.discript=null
        this.type=null
        this.test=null
        this.callback=null
    }
    /**
     * 加载
     * @returns 
     */
    Loading(){
        reg_Data[this.model_name]={
            "name":this.model_name,
            "discript":this.discript,
            "user_permission":this.user_permission,
            "group_permission":this.group_permission,
            "type":this.type,
            "test":this.test,
            "callback":this.callback
        }
        if(!conf_data[this.model_name]){conf_data[this.model_name]=true;conf.writeKeyData(this.model_name,true)}
        this.distroy()
        return reg_Data
    }
    /**
     * 设置开启情况
     * @param {string} name 
     * @param {*} state 
     * @returns 
     */
    static magNotice(name=null,state){
        if(!name){
            return conf_data
        }
        if(!reg_Data[name]){return false}
        conf_data[name]=state
        conf.writeKeyData(name,state)
        return true
    }
    /**
     * 检测并执行
     * @param {object} context 
     * @param {string} type 
     * @param {number} user_id 
     * @param {number} self_id 
     * @param {number} _group_id 
     * @returns 
     */
    static async testnotice(context,type,user_id,self_id,_group_id){
        const userper=Mag_per.getUserPer(user_id)
        const groupper=Mag_per.getGroupPer(_group_id)
        let location=null,test_request=false
        for (let key in reg_Data){
            if(!reg_Data[key]) {continue}
            if(reg_Data[key].user_permission>userper||reg_Data[key].group_permission>groupper){continue}
            if(!reg_Data[key].type.includes(type)) {continue}
            let test=reg_Data[key].test
            test_request=await test(context,type,user_id,self_id,_group_id)
            if(test_request){
                location = key
                break
            }
            continue
        }
        if(location===null){return false}
        let callback=reg_Data[location].callback
        await callback(context,type,test_request,user_id,self_id,_group_id)
        return true
    }
}
export default Reg_notice


export class List_notice {
    static list_all_notice(user_id,_group_id){
        const userper=Mag_per.getUserPer(user_id)
        const groupper =(_group_id && Mag_per.getGroupPer(_group_id)) || 0
        let output=["[Reg_notice]已注册如下检测\n"]
        for (let key in reg_Data){
            if ((!conf_data[key]) && (userper !== 2)) continue
            if (userper < reg_Data[key].user_permission || groupper < reg_Data[key].group_permission) continue
            output.push(" - \"" + reg_Data[key].name + "\" " + reg_Data[key].discript + "\n")
            continue
        }
        output.push("- tips:输入 [:henotice <模块名>] 可以查看检测详情")
        return output.join("")
    }
    static get_notice(name,user_id,_group_id){
        const userper = Mag_per.getUserPer(user_id)
        const groupper = (_group_id && Mag_per.getGroupPer(_group_id)) || 0
        if(!reg_Data[name]){return `[Reg_notice"${name}"不是有效名称`}
        let output=["[Reg_notice]"]
        if (userper < reg_Data[name].user_permission || groupper < reg_Data[name].group_permission) { return `[Reg_notice]不符合权限要求` }
        output.push(`\n名:"${name}"\n描述:${reg_Data[name].discript}\n`)
        output.push(`监测notice类型:${reg_Data[name].type.join(",")}\n`)
        if (userper >= reg_Data[name].user_permission) {
            output.push(`permission:[user:${reg_Data[name].user_permission},group:${reg_Data[name].group_permission}]\n`)
        }
        output.push("- tips:全是函数怎么列出来")
        return output.join("")
    }
}