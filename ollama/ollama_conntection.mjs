class Ai {
    /**
     * 长对话chat
     * @param {["system:系统提示词","assistant:助手回复","user:用户消息"]} history 
     * @param {{"system":"系统提示词","prompt":"提示词","image":"图片base64"}} prompt 
     * @param {*} url 
     * @param {*} model 
     * @param {*} temperature 
     * @param {*} top_k 
     * @param {*} top_p 
     * @param {object} _another_conf 
     * @returns 
     */
    static async chat(history, prompt, url, model, temperature, top_k, top_p, _another_conf = {}) {
        try {
            const response = await fetch(url + "/api/chat", {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(Object.assign({
                    "model": model,
                    "messages": Ai.format_messages(history, prompt.prompt, prompt.image, prompt.system),
                    "stream": false,
                    "options": {
                        "temperature": temperature,
                        "top_k": top_k,
                        "top_p": top_p
                    }
                }, _another_conf)),
                redirect: 'follow'
            })
            const result = await response.text()
            return { "response": JSON.parse(result).message.content, "ori_history": history }
        } catch (err) {
            console.log(err)
            return false
        }
    }
    //{"system":"qwertyui","prompt":"qwrtyuiop","image":"1234567890ert"}
    /**
     * 单次对话
     * @param {{"system":"系统提示词","prompt":"提示词","image":"图片base64"}} prompt 
     * @param {*} url 
     * @param {*} model 
     * @param {*} temperature 
     * @param {*} top_k 
     * @param {*} top_p 
     * @param {*} _another_conf 
     * @returns 
     */
    static async generate(prompt, url, model, temperature, top_k, top_p, _another_conf) {
        try {
            const response = await fetch(url + "/api/generate", {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(Object.assign({
                    "model": model,
                    "prompt": prompt.prompt,
                    "image": prompt.image,
                    "system": prompt.system,
                    "stream": false,
                    "options": {
                        "temperature": temperature,
                        "top_k": top_k,
                        "top_p": top_p
                    }
                }, _another_conf)),
                redirect: 'follow'
            })
            const result = await response.text()
            return { "response": JSON.parse(result).response }
        } catch (err) {
            console.log(err)
            return false
        }
    }
    /**
     * 格式化历史消息
     * @param {["system:系统提示词","assistant:助手回复","user:用户消息"]} _history 
     * @param {string} _prompt 添加
     * @param {string} _img 添加图片
     * @param {string} _system 
     * @returns 
     */
    static format_messages(_history, _prompt, _img, _system) {
        // 创建新数组，复制并转换每个历史消息为对象
        let messages = _history.map(item => {
            let colonIndex = item.indexOf(':');
            return {
                role: item.substring(0, colonIndex),
                content: item.substring(colonIndex + 1)
            };
        });

        if (_system) {
            messages.unshift({
                role: "system",
                content: _system
            });
        }

        if (_prompt || _img) {
            messages.push({
                role: "user",
                content: _prompt,
                image: _img
            });
        }

        return messages;
    }
}


export default Ai
//["system:qqqqqqqqq","assistant:yyyyyyyyyyy","user:ertyuiop"]