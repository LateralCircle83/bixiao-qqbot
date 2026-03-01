import { execute } from "./execute.mjs"

const { version } = await import("./version.mjs")
const { withdraw } = await import("./withdraw.mjs")
const { image } = await import("./image.mjs")
const { msg } = await import("./message.mjs")
const { record } = await import("./audio.mjs")
const {desmos}=await import("./desmos.mjs")



version()
withdraw()
image()
msg()
record()
desmos()
execute()