const { createServer: createServer } = require("http"), { writeFile: writeFile } = require("fs"), { join: join } = require("path");

function checkMethod(e) { if (!["GET", "POST", "PUT", "DELETE", "PATCH"].includes(e)) throw new Error("invalid method") }

function checkPath(e) { if ("string" != typeof e) { if (!(e instanceof RegExp)) throw new Error("path must be string or RegExp"); if (!e.source.startsWith("^\\/") || !e.source.endsWith("$")) throw new Error("path must start with ^/ and ends with $") } else if (!e.startsWith("/")) throw new Error("path must start with /") }
class RegexRouter {
    constructor() { this.routes = new Map, this.middlewares = [], this.notFoundHandler = ((e, t) => { t.statusCode = 404, t.end(JSON.stringify({ error: "Not found" })) }), this.internalErrorHandler = ((t, s) => { s.statusCode = 500, s.end(JSON.stringify({ error: e.message })) }) }
    use(e) { this.middlewares.push(e), this.notFoundHandler = e(this.notFoundHandler), this.internalErrorHandler = e(this.internalErrorHandler) }
    register(e, t, s, ...r) {
        checkMethod(e), checkPath(t), s = r.reduce((e, t) => t(e), s), s = this.middlewares.reduce((e, t) => t(e), s), this.routes.has(e) ? this.routes.get(e).set(t, s) : this.routes.set(e, new Map([
            [t, s]
        ]))
    }
    handle(e, t) { if (!this.routes.has(e.method)) return void this.notFoundHandler(e, t); const s = [...this.routes.get(e.method).entries()].find(([t, s]) => "string" == typeof t ? t === e.url : t.test(e.url)); if (void 0 === s) return void this.notFoundHandler(e, t); const [r, o] = s; try { r instanceof RegExp && (e.matches = r.exec(e.url).groups), o(e, t) } catch (s) { this.internalErrorHandler(e, t) } }
}
const cors = e => (t, s) => {
        if (!t.headers.origin) return void e(t, s);
        const r = { "access-control-allow-origin": "*" };
        if ("OPTIONS" !== t.method) { Object.entries(r).forEach(([e, t]) => s.setHeader(e, t)); try { return void e(t, s) } catch (e) { throw e.headers = {...e.headers, ...r }, e } }
        t.headers["access-control-request-method"] && (Object.entries({...r, "access-control-allow-methods": "GET, POST, PUT, DELETE, PATCH" }).forEach(([e, t]) => s.setHeader(e, t)), t.headers["access-control-request-headers"] && s.setHeader("access-control-allow-headers", t.headers["access-control-request-headers"]), s.statusCode = 204, s.end())
    },
    slow = e => (t, s) => { setTimeout(() => { e(t, s) }, 1e3) },
    log = e => (t, s) => { console.info(`incoming request: ${t.method} ${t.url}`), e(t, s) },
    json = e => (t, s) => {
        const r = [];
        t.on("data", e => { r.push(e) }), t.on("end", () => {
            try { t.body = JSON.parse(Buffer.concat(r).toString()), console.info(t.body) } catch (e) { return s.statusCode = 400, void s.end() }
            e(t, s)
        })
    },
    multipart = e => (t, s) => {
        const r = "\r\n".repeat(2),
            o = e => { const t = { name: null, type: null }; for (const s of e.toLowerCase().split("\r\n")) s.startsWith("content-disposition") ? t.name = /name="(?<name>[^"]*)"/.exec(s).groups.name : s.startsWith("content-type") && (t.type = s.split(":")[1].trim()); return t },
            n = [];
        t.on("data", e => { n.push(e) }), t.on("end", () => {
            try {
                t.body = ((e, t) => {
                    const s = {},
                        [n, i] = t.split(";").map(e => e.trim()).map(e => e.replace("boundary=", "")),
                        a = `--${i}\r\n`,
                        d = e.indexOf(a);
                    if (-1 === d) throw new Error("invalid multipart");
                    const c = `--${i}--\r\n`,
                        p = e.indexOf(c);
                    if (-1 === p) throw new Error("invalid multipart");
                    let u = d,
                        l = u;
                    do {
                        (-1 === (l = e.indexOf(a, u + a.length)) || l > p) && (l = p);
                        const t = e.slice(u + a.length, l),
                            n = t.indexOf(r),
                            i = t.slice(0, n).toString(),
                            d = t.slice(n + r.length, t.length - "\r\n".length),
                            c = o(i);
                        s[c.name] = { type: c.type, content: d }, u = l
                    } while (l !== p);
                    return console.log(s), s
                })(Buffer.concat(n), t.headers["content-type"])
            } catch (e) { return s.statusCode = 400, void s.end() }
            e(t, s)
        })
    },
    translateType = e => e.startsWith("audio/") ? "audio" : e.startsWith("video/") ? "video" : e.startsWith("image/") ? "image" : "unknown",
    router = new RegexRouter;
router.use(log), router.use(cors);
let nextId = 1,
    nextCommentId = 1,
    contacts = [];
const itemsPerRequest = 5;
router.register("GET", "/api/posts", (e, t) => { t.setHeader("Content-Type", "application/json"), t.end(JSON.stringify(contacts)) }, slow), router.register("GET", /^\/api\/posts\/after\/(?<id>\d+)$/, (e, t) => {
    const s = Number(e.matches.id);
    if (Number.isNaN(s)) return t.statusCode = 400, t.setHeader("Content-Type", "application/json"), void t.end(JSON.stringify({ error: "bad id" }));
    const r = contacts.filter(e => e.id > s),
        o = r.slice(r.length - 5 >= 0 ? r.length - 5 : 0);
    t.setHeader("Content-Type", "application/json"), t.end(JSON.stringify(o))
}, slow), router.register("GET", /^\/api\/posts\/before\/(?<id>\d+)$/, (e, t) => {
    const s = Number(e.matches.id);
    if (Number.isNaN(s)) return t.statusCode = 400, t.setHeader("Content-Type", "application/json"), void t.end(JSON.stringify({ error: "bad id" }));
    const r = contacts.filter(e => e.id < s).slice(0, 5);
    t.setHeader("Content-Type", "application/json"), t.end(JSON.stringify(r))
}, slow), router.register("POST", "/api/posts", (e, t) => {
    const s = e.body;
    0 === s.id ? (s.id = nextId++, contacts = [s, ...contacts]) : contacts = contacts.map(e => e.id !== s.id ? e : {...e,
        name: s.name,
        phone: s.phone,
        phone2: s.phone2,
        email: s.email,
        email2: s.email2,
        address: s.address,
        address2: s.address2
    }), t.setHeader("Content-Type", "application/json"), t.end(JSON.stringify(s))
}, json, slow), router.register("DELETE", /^\/api\/posts\/(?<id>\d+)$/, (e, t) => {
    const s = Number(e.matches.id);
    if (Number.isNaN(s)) return t.statusCode = 400, t.setHeader("Content-Type", "application/json"), void t.end(JSON.stringify({ error: "bad id" }));
    contacts = contacts.filter(e => e.id !== s), t.statusCode = 204, t.end()
}, slow), router.register("POST", /^\/api\/posts\/(?<id>\d+)\/likes$/, (e, t) => {
    const s = Number(e.matches.id);
    if (Number.isNaN(s)) return t.statusCode = 400, t.setHeader("Content-Type", "application/json"), void t.end(JSON.stringify({ error: "bad id" }));
    contacts = contacts.map(e => e.id !== s ? e : {...e, likes: e.likes + 1 }), t.statusCode = 204, t.end()
}, slow), router.register("DELETE", /^\/api\/posts\/(?<id>\d+)\/likes$/, (e, t) => {
    const s = Number(e.matches.id);
    if (Number.isNaN(s)) return t.statusCode = 400, t.setHeader("Content-Type", "application/json"), void t.end(JSON.stringify({ error: "bad id" }));
    contacts = contacts.map(e => e.id !== s ? e : {...e, likes: e.likes - 1 }), t.statusCode = 204, t.end()
}, slow), router.register("POST", /^\/api\/posts\/(?<id>\d+)\/comments$/, (e, t) => {
    const s = Number(e.matches.id);
    if (Number.isNaN(s)) return t.statusCode = 400, t.setHeader("Content-Type", "application/json"), void t.end(JSON.stringify({ error: "bad id" }));
    const r = e.body;
    r.id = nextCommentId++, contacts = contacts.map(e => e.id !== s ? e : {...e, comments: [...e.comments, r] }), t.setHeader("Content-Type", "application/json"), t.end(JSON.stringify(r))
}, json, slow), router.register("POST", "/api/media", (e, t) => {
    const { media: s } = e.body;
    if (void 0 === s) return t.statusCode = 400, t.setHeader("Content-Type", "application/json"), void t.end(JSON.stringify({ error: "no media element" }));
    const r = translateType(s.type);
    if ("unknown" === r) return t.statusCode = 400, t.setHeader("Content-Type", "application/json"), void t.end(JSON.stringify({ error: "unknown media type" }));
    const o = `
        $ { Date.now() }
        `;
    writeFile(join("static", o), s.content, e => {
        if (null !== e) return t.statusCode = 500, t.setHeader("Content-Type", "application/json"), void t.end(JSON.stringify({ error: `
        can 't write file: ${e.message}` }));
        const s = { type: r, path: `/static/${o}` };
        t.setHeader("Content-Type", "application/json"),
            t.end(JSON.stringify(s))
    })
}, multipart, slow);
const server = createServer((e, t) => router.handle(e, t));
server.listen(9999, () => { console.info("server started at http://127.0.0.0.1:9999") });