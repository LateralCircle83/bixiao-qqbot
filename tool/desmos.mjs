import Reg_cmd from "../basic/Command_register.mjs"
import Fast_conf from "../basic/Fast_config.mjs"
import { Eazy_post } from "../basic/napcat_conntection.mjs"


const conf = new Fast_conf("Desmos", "desmos_cookies.json")
await conf.setBaseData({})
const all_cookies = conf.getAllData()


const baseUrl = {
    calc: "https://www.desmos.com/calculator/",
    geom: "https://www.desmos.com/geometry/",
    d3: "https://www.desmos.com/3d/"
}

const Desmos = {
    get_cookie: async function (email, password) {
        try {
            const response = await fetch("https://www.desmos.com/account/login_xhr", { method: "POST", headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }, credentials: 'include', body: `email=${encodeURIComponent(email)}&password=${password}&lang=zh-CN` })
            //console.log(response)
            if (!response.ok) return false
            const cookie = response.headers.get('set-cookie')
            //console.log(cookie)
            if (!cookie) return false
            return cookie
        } catch (err) {
            console.log(err)
            return false
        }
    },
    get_calc_data: async function (url, _base) {
        try {
            const response = await fetch(`${(_base === "calc" && baseUrl.calc) || (_base === "geom" && baseUrl.geom) || (_base === "3d" && baseUrl.d3) || ""}${url}`, { method: "GET", headers: { "Accept": "application/json", "Content-Type": "application/json; charset=utf-8" }, redirect: 'follow' })
            if (!response.ok) return false
            const result = await response.text()
            const data = JSON.parse(result)
            return [`标题:${data.title}`, `创建时间:${data.created}\n此图表保存时间:${data.versionCreatedAt}`, `数据链接:${data.stateUrl}`, `封面链接:${data.thumbUrl}$#@<_image>${data.thumbUrl}$#@`, `类型:${data.type}`, `物量:${data.state.expressions.list.length}`]
        } catch (err) {
            return false
        }
    },
    get_log_state: async function (cookie) {
        try {
            const response = await fetch("https://www.desmos.com/account/user_info", { method: "GET", headers: { "Content-Type": "application/json; charset=utf-8", "Cookie": cookie }, redirect: 'follow' })
            if (!response.ok) return false
            const result = await response.text()
            const data = JSON.parse(result)
            return `userId:${data.userId}\nname:${data.name}\nemail:${data.email}`
        } catch {
            return false
        }
    },
    get_log_data_list: async function (cookie) {
        try {
            const response = await fetch("https://www.desmos.com/api/v1/calculator-shared/my_graphs?lang=zh-CN", { method: "GET", headers: { "Content-Type": "application/json; charset=utf-8", "Cookie": cookie }, redirect: 'follow' })
            if (!response.ok) return false
            const result = await response.text()
            const data = JSON.parse(result).myGraphs
            //console.log(data)
            const output = []
            if (data.graphs2d.length !== 0) {
                let output_2d = ["2d图表:"]
                for (let i = 0, len = data.graphs2d.length; i < len; i++) {
                    output_2d.push(`${i}.title:${data.graphs2d[i].title}\nhash:${data.graphs2d[i].hash}\n创建时间:${data.graphs2d[i].created}\n最后更改${data.graphs2d[i].versionCreatedAt}`)
                }
                for (let i = 0; i < output_2d.length; i += 50) {
                    //const str = arr.slice(i, i + 50).join('');
                    output.push(output_2d.slice(i, i + 50).join('\n'));
                }
            }
            if (data.graphsGeometry.length !== 0) {
                let output_3d = ["几何图表:"]
                for (let i = 0, len = data.graphsGeometry.length; i < len; i++) {
                    output_3d.push(`${i}.title:${data.graphsGeometry[i].title}\nhash:${data.graphsGeometry[i].hash}\n创建时间:${data.graphsGeometry[i].created}\n最后更改${data.graphsGeometry[i].versionCreatedAt}`)
                }
                for (let i = 0; i < output_3d.length; i += 50) {
                    //const str = arr.slice(i, i + 50).join('');
                    output.push(output_3d.slice(i, i + 50).join('\n'));
                }
            }
            if (data.graphs3d.length !== 0) {
                let output_3d = ["3d图表:"]
                for (let i = 0, len = data.graphs3d.length; i < len; i++) {
                    output_3d.push(`${i}.title:${data.graphs3d[i].title}\nhash:${data.graphs3d[i].hash}\n创建时间:${data.graphs3d[i].created}\n最后更改${data.graphs3d[i].versionCreatedAt}`)
                }
                for (let i = 0; i < output_3d.length; i += 50) {
                    //const str = arr.slice(i, i + 50).join('');
                    output.push(output_3d.slice(i, i + 50).join('\n'));
                }
            }
            return output
        } catch (err) {
            console.log(err)
            return false
        }
    }
}

export function desmos() {
    const cmd = new Reg_cmd("tool", ":desmos", 0, 0)
    cmd.setDiscript("desmos工具")
    cmd.setAlias(":des")
    cmd.setLine([Reg_cmd.choose("login"), Reg_cmd.text("邮箱"), Reg_cmd.text("密码")])
    cmd.setLine([Reg_cmd.choose("logout")])
    cmd.setLine([Reg_cmd.choose("get_data"), Reg_cmd.text("图表链接")], [Reg_cmd.choose("3d", "calc", "geom")])
    cmd.setLine([Reg_cmd.choose("get_log"), Reg_cmd.choose("base", "save")])
    cmd.setCallback(async (data, root, user_id, self_id, _group_id, _reply) => {
        switch (data[0]) {
            case "login":
                let login_cookie = await Desmos.get_cookie(data[1], data[2])
                if(!login_cookie){
                    await Eazy_post.content("[Desmos]登录失败！请检查是否输入错误",user_id,_group_id)
                    return
                }
                all_cookies[user_id] = login_cookie
                conf.writeAllData(all_cookies)
                await Eazy_post.content("[Desmos]登录成功！",user_id,_group_id)
                return
            case "logout":
                if(!all_cookies[user_id]){
                    await Eazy_post.content("[Desmos]查询不到登录信息",user_id,_group_id)
                    return
                }
                delete all_cookies[user_id]
                conf.writeAllData(all_cookies)
                await Eazy_post.content("[Desmos]已删除登录信息",user_id,_group_id)
                return
            case "get_data":
                let get_data_response = await Desmos.get_calc_data(data[1], data[2])
                if (!get_data_response) {
                    await Eazy_post.content("[Desmos]非有效链接",user_id,_group_id)
                    return
                }
                await Eazy_post.content_forward(get_data_response, "Desmoser", user_id, _group_id)
                return
            case "get_log":
                if(!all_cookies[user_id]){
                    await Eazy_post.content("[Desmos]未登录，请先登录",user_id,_group_id)
                    return
                }
                if(data[1]==="base"){
                    let get_log_request=await Desmos.get_log_state(all_cookies[user_id])
                    if(!get_log_request){
                        await Eazy_post.content("[Desmos]获取数据失败",user_id,_group_id)
                        return
                    }
                    await Eazy_post.content(get_log_request,user_id,_group_id)
                    return
                }
                if(data[1]==="save"){
                    let get_log_request=await Desmos.get_log_data_list(all_cookies[user_id])
                    if(!get_log_request){
                        await Eazy_post.content("[Desmos]获取数据失败",user_id,_group_id)
                        return
                    }
                    await Eazy_post.content_forward(get_log_request,"Desmoser",user_id,_group_id)
                    return
                }
                break
        }
    })
    cmd.Loading()
}













// const axios = {
//     get: async function (url, head) {
//         const request = await fetch(url, {
//             method: 'GET',
//             headers: head,
//             redirect: 'follow'
//         })
//         const result = await request.text()
//         //console.log(result)
//         return JSON.parse(result)
//     },
//     post: async function (url, head, body) {
//         const request = await fetch(url, {
//             method: 'POST',
//             headers: head,
//             redirect: 'follow',
//             body: JSON.stringify(body)  // 添加请求体
//         })
//         const result=await request.text()
//         return JSON.parse(result)
//     }
// }