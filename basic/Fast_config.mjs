//快速配置设置文件

import readline from 'readline'
const fs = await import('fs')
const path = "./config/"
//console.log(process.cwd())
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
function input(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}


class Fast_conf {
    /**
     * 配置文件编辑器
     * @param {string} name 唯一name
     * @param {string | undefined} file 文件
     */
    constructor(name, file = "config.json") {
        this.name = name
        this.file = file
    }
    /**
     * 判断设置文件是否存在
     * @returns {boolean}
     */
    testFile() {
        return fs.existsSync(path + this.file) && fs.readFileSync(path + this.file, "utf-8") && true
    }
    /**
     * 设置初始化信息
     * @param {JSON} data 数据
     * @param {boolean} strict 是否开启填充,需要吧需要填充的值换成”space“
     * @returns {boolean} 是否成功
     */
    async setBaseData(data, strict) {
        try {
            if (!data) { return false }
            if (this.testFile()) { return true }//已经有数据，返回
            let data_change = data
            if (strict) {
                for (let key in data_change) {
                    if (data_change[key] === "space") {
                        data_change[key] = await input("[" + this.name + "]请输入" + key + ":")
                    }
                }
            }
            this.writeAllData(data_change)
        } catch (err) {
            console.log(err)
            return false
        }
    }
    /**
     * 获取全部信息
     * @returns {JSON} 
     */
    getAllData() {
        try {
            if (this.file === "config.json") {
                let rd = Fast_conf.getRootData()
                return rd[this.name]
            }
            return JSON.parse(fs.readFileSync(path + this.file, "utf-8"))
        } catch (err) {
            console.log(err)
            return false
        }
    }
    /**
     * 依托式写入
     * @param {JSON} data 写入的数据 
     * @returns 
     */
    writeAllData(data) {
        try {
            let data_change = data
            if (this.file === "config.json") {
                let rd = Fast_conf.getRootData()
                rd[this.name] = data
                data_change = rd
            }
            fs.writeFileSync(path + this.file, JSON.stringify(data_change, null, 4))
            this.clearCache()
            return true
        } catch (err) {
            console.log(err)
            return false
        }
    }
    /**
     * 获取某一数据
     * @param {string} key 键值对
     * @returns {any}
     */
    getKeyData(key) {
        try {
            let ori = this.getAllData()
            if (!ori[key]) { return false }
            return ori[key]
        } catch (err) {
            console.log(err)
            return false
        }
    }
    /**
     * 单独写入一个数据
     * @param {string} key 键值对
     * @param {any} data 数据
     * @returns {boolean}
     */
    writeKeyData(key, data) {
        try {
            let ori = this.getAllData()
            ori[key] = data
            this.writeAllData(ori)
            return true
        } catch (err) {
            console.log(err)
            return false
        }
    }
    /**
     * 获取根设置数据
     * @returns {JSON} 
     */
    static getRootData() {
        try {
            if (fs.existsSync(path + "config.json") && fs.readFileSync(path + "config.json", "utf-8") && true) {
                return JSON.parse(fs.readFileSync(path + "config.json", "utf-8"))
            } else {
                fs.writeFileSync(path + "config.json", "{}")
                return JSON.parse(fs.readFileSync(path + "config.json", "utf-8"))
            }
        } catch (err) {
            console.log(err)
            return false
        }
    }
    /**
     * 回收站
     */
    clearCache() {
        this.cache = null
        this.cacheTime = null
    }
}
export default Fast_conf