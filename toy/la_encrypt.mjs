import Reg_cmd from "../basic/Command_register.mjs";
import Reg_test from "../basic/Input_register.mjs";
import { Eazy_post } from "../basic/napcat_conntection.mjs";
import { Image } from "../tool/image.mjs";

//顺反加密主函数
function repart(input) {

    //for (var i=0,arout=[],arr=input.split(""),output;i<arr.length;i++,console.log(i)) arout.push(((i+1)%2&&(arr[i]))||(((arr.length%2 != 0)&&arr[arr.length-i-1])||arr[arr.length-i]))
    //return arout.join("")
    //for (var i=0,arout="",len=input.length;i<len;i++) arout+=(((i+1)%2&&(input[i]))||(((len%2 != 0)&&input[len-i-1])||input[len-i]))
    //return arout
    let arout = [];
    for (let i = 0, len = input.length; i < len; i++) {
        arout.push(((i + 1) % 2 && (input[i])) || (((len % 2 != 0) && input[len - i - 1]) || input[len - i]));
        continue;
    };
    return arout.join("");
}
//顺反加密接入
/*function reverse(data, sign) {
    if (data.length < sign) {
        return (repart(data))
    } else {
        let list = []
        for (let i = sign, len = data.length; len - i >= 0; i = i + sign) {
            list.push(repart(data.slice(i - sign, i)))
            continue
        }
        list.push(repart(data.slice(sign * list.length)) || "")
        return (list.join(""))
    }
}*/
//兽音加密
//const sign_d = [["嗷", "喵"], ["呜"], ["啊"], ["~"]]
function infurr(input, sign) {
    function getMv(left, right, sign) {
        function random(data) {
            return data[Math.floor(data.length * Math.random())];
        };
        return [random(sign[Math.floor(parseInt(`0x${left}`) / 4)]) + random(sign[parseInt(`0x${left}`) % 4 + parseInt(`0x${right}`) % 4]),
        random(sign[Math.floor(parseInt(`0x${right}`) / 4 + Math.floor(parseInt(`0x${left}`) / 4))]) + random(sign[parseInt(`0x${right}`) % 4])];
    };

    function add0(str) {
        return ((str.length === 2) && `00${str}`) || ((str.length === 3) && `0${str}`) || str;
    };
    sign.push(...sign);
    let data = [],
        list = []; /*list_one = [],
  list_two = [],*/
    for (let i = 0; i < input.length; i++) {
        data.push(add0(input[i].charCodeAt(0).toString(16)));
        continue;
    };
    data = data.join("");
    for (let i = 0, len = data.length; i < len / 2; i++) {
        //list_one.push(getMv(data[i], data[len - 1 - i], sign)[0]);
        //list_two.unshift(getMv(data[i], data[len - 1 - i], sign)[1]);
        list.splice(i, 0, getMv(data[i], data[len - 1 - i], sign)[0], getMv(data[i], data[len - 1 - i], sign)[1]);
        continue;
    };
    //list_one.push(...list_two);
    //return list_one.join("");
    return list.join("");
};
//兽音解密
function outfurr(input, sign) {
    function getMc(left, right, sign) {
        /*let d = [parseInt(sign[left[0]]),
          parseInt(sign[left[1]]),
          parseInt(sign[right[0]]),
          parseInt(sign[right[1]])];*/
        /*return [(d[0] * 4 + d[1] - d[3] + ((d[1] - d[3] < 0) && 4 || 0)).toString(16),
          ((d[2] - d[0] + ((d[2] - d[0] < 0 && 4) || 0)) * 4 + d[3]).toString(16)];*/
        return [(parseInt(sign[left[0]]) * 4 + parseInt(sign[left[1]]) - parseInt(sign[right[1]]) + ((parseInt(sign[left[1]]) - parseInt(sign[right[1]]) < 0) && 4 || 0)).toString(16),
        ((parseInt(sign[right[0]]) - parseInt(sign[left[0]]) + ((parseInt(sign[right[0]]) - parseInt(sign[left[0]]) < 0 && 4) || 0)) * 4 + parseInt(sign[right[1]])).toString(16)];
    };
    let resign = {},
        list_one = [],
        /*list_two = [],*/
        list = [];
    for (let i = 0; i < sign.length; i++) {
        for (let ele of sign[i]) {
            resign[ele] = String(i);
        };
        continue;
    };
    for (let i = 0, len = input.length; i < len / 2; i += 2) {
        //list_one.push(getMc(input.slice(i, i + 2), input.slice(-i - 2 + len, len - i), resign)[0]);
        //list_two.unshift(getMc(input.slice(i, i + 2), input.slice(-i - 2 + len, len - i), resign)[1]);
        list_one.splice(i / 2, 0, getMc(input.slice(i, i + 2), input.slice(-i - 2 + len, len - i), resign)[0], getMc(input.slice(i, i + 2), input.slice(-i - 2 + len, len - i), resign)[1]);
        continue;
    };
    //list_one.push(...list_two);
    for (let i = 0; i < list_one.length; i += 4) {
        list.push(String.fromCharCode(parseInt(list_one.slice(i, i + 4).join(""), 16)));
        continue;
    };
    return list.join("");
};


//主类
class La_encrypt {
    static reverse(data, sign) {
        if (sign == null && typeof data == "string") return repart(data);
        if (typeof data != "string" || typeof sign != "number" || sign <= 0) return false;
        if (data.length < sign) {
            return repart(data);
        } else {
            let list = [];
            for (let i = sign, len = data.length; len - i >= 0; i = i + sign) {
                list.push(repart(data.slice(i - sign, i)));
                continue;
            };
            list.push(repart(data.slice(sign * list.length)) || "");
            return (list.join(""));
        };
    };
    static infurr(data, _sign) {
        if (typeof data != "string" || (typeof _sign == "object" && _sign.length !== 4)) return true;
        return infurr(data, _sign || [["嗷", "喵"], ["呜"], ["啊"], ["~"]]);
    };
    static defurr(data, _sign) {
        if (typeof data != "string" || data.length % 2 != 0 || (typeof _sign == "object" && _sign.length !== 4)) return false;
        return outfurr(data, _sign || [["嗷", "喵"], ["呜"], ["啊"], ["~"]]);
    };
    /**
     * 格式化密码
     * @param {*} data 
     * @returns 
     */
    static formsign(data) {
        let ori = data.split(",")
        if (ori.length !== 4) return false
        ori = ori.map(value => {
            return value.split("")
        })
        return ori
    }
    /**
     * 输入是否合法
     * @param {*} data 
     * @param {string} sign 
     * @returns 
     */
    static testinput(data, sign) {
        if (data.length % 8 !== 0) return false
        let arr = sign.replace(/[,]/g, '')
        //console.log(arr)
        const allowedSet = new Set(arr);
        for (let i = 0; i < data.length; i++) {
            if (!allowedSet.has(data[i])) {
                return false;
            }
        }
        return true;
    }
};

//module.exports.reverse = reverse
export function encrypt() {
    const cmd_inff = new Reg_cmd("toy", ":beast", 0, 0)
    cmd_inff.setDiscript("兽音加密")
    cmd_inff.setLine([Reg_cmd.choose("en", "de"), Reg_cmd.text()], [Reg_cmd.text("密钥")])
    cmd_inff.setCallback(async (data, root, user_id, self_id, _group_id, _reply) => {
        let output = [], sign = "嗷唔,呜惹,啊嗯,~"
        switch (data[0]) {
            case "en":
                // if(data[2]){
                //   sign=La_encrypt.formsign(data[2])
                //   if(!sign) {
                //     output.join("[Beast_encrypt]无效的密码")
                //     break
                //   }
                // }
                if (data[2]) {
                    sign = data[2]
                }
                //console.log(La_encrypt.formsign(sign))
                sign = La_encrypt.formsign(sign)
                if (!sign) {
                    output.push("[Beast_encrypt]无效的密码")
                    break
                }
                // console.log("前",La_encrypt.infurr)
                // let call= La_encrypt.infurr(data[1], sign)
                // console.log("后",call,La_encrypt.infurr)
                await Eazy_post.content(La_encrypt.infurr(data[1], sign), user_id, _group_id)
                return
            case "de":
                if (data[2]) {
                    sign = data[2]
                }
                //console.log(sign)
                if (!La_encrypt.testinput(data[1], sign)) {
                    output.push("[Beast_encrypt]不合法的输入")
                    break
                }
                sign = La_encrypt.formsign(sign)
                if (!sign) {
                    output.push("[Beast_encrypt]无效的密码")
                    break
                }
                await Eazy_post.content(La_encrypt.defurr(data[1], sign), user_id, _group_id)
                return
        }
        await Eazy_post.content(output.join(""), user_id, _group_id)
    })
    cmd_inff.Loading()

    const keyword = new Reg_test("beast", 0, 0)
    keyword.setDiscript("识别兽音译者")
    keyword.setTest((data, user_id, self_id, _group_id, _reply, _at) => {
        let ori = data.trim().split(/\s+/), sign = "嗷唔,呜惹,啊嗯,~"
        //console.log(sign)
        if (ori.length === 2) {
            sign = ori[1]
        }
        //console.log(La_encrypt.testinput(ori[0],sign))
        if (!La_encrypt.testinput(ori[0], sign)) return false
        sign = La_encrypt.formsign(sign)
        if (!sign) return false
        //console.log(sign)
        return La_encrypt.defurr(ori[0], sign)
    })
    keyword.setCallback(async (data, testreturn, user_id, self_id, _group_id, _reply, _at) => {

        await Eazy_post.content(Image.format(testreturn), user_id, _group_id)
    })
    keyword.Loading()

    const cmd_repart = new Reg_cmd("toy", ":repart", 0, 0)
    cmd_repart.setDiscript("顺反加密")
    cmd_repart.setLine([Reg_cmd.text()])
    cmd_repart.setCallback(async (data, root, user_id, self_id, _group_id, _reply) => {
        await Eazy_post.content(Image.format(La_encrypt.reverse(data[0])), user_id, _group_id)
    })
    cmd_repart.Loading()
}