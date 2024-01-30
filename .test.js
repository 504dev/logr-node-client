const { Logr } = require('./index')
const { Levels } = require('./levels')

const conf = new Logr({
    udp: ':7776',
    publicKey: 'MDwwDQYJKoZIhvcNAQEBBQADKwAwKAIhAOLnmpSWqMqmbIpJ131v8SHjB9sJ3Z8eLAFpG+N/5pfhAgMBAAE=',
    privateKey: 'MIGsAgEAAiEA4uealJaoyqZsiknXfW/xIeMH2wndnx4sAWkb43/ml+ECAwEAAQIhAIzv9Mkkh3VQSAzhbtMALBKHkT2H1I9sC+DcPzbmWGgBAhEA/RlqVM4qVn/Br3F/Fdy0IQIRAOWBVaCG144XHahlXW4Za8ECEQCDd8ItzvFbAP2gnjm/J2dBAhAZBzi6T9o0AatXUO6WcilBAhEA0zieT6DdNrQ8cKb56tiPSA==',
    noCipher: false
})

const bigJson = {"id":9,"name":"STABLE","currencies":[{"id":39,"ticker":"usdt","is_shortlist":true,"is_shitlist":false,"is_enabled":true,"liq_is_active":true},{"id":210,"ticker":"usd","is_shortlist":true,"is_shitlist":false,"is_enabled":true,"liq_is_active":false},{"id":213,"ticker":"dai","is_shortlist":true,"is_shitlist":false,"is_enabled":true,"liq_is_active":true},{"id":214,"ticker":"tusd","is_shortlist":true,"is_shitlist":false,"is_enabled":true,"liq_is_active":true},{"id":235,"ticker":"eurs","is_shortlist":true,"is_shitlist":false,"is_enabled":true,"liq_is_active":true},{"id":250,"ticker":"gusd","is_shortlist":true,"is_shitlist":false,"is_enabled":true,"liq_is_active":true},{"id":461,"ticker":"usdc","is_shortlist":true,"is_shitlist":false,"is_enabled":true,"liq_is_active":true},{"id":469,"ticker":"eur","is_shortlist":true,"is_shitlist":false,"is_enabled":true,"liq_is_active":false},{"id":478,"ticker":"pax","is_shortlist":true,"is_shitlist":false,"is_enabled":true,"liq_is_active":true},{"id":493,"ticker":"usdb","is_shortlist":true,"is_shitlist":false,"is_enabled":true,"liq_is_active":false},{"id":508,"ticker":"eurb","is_shortlist":true,"is_shitlist":false,"is_enabled":true,"liq_is_active":false},{"id":530,"ticker":"usdt20","is_shortlist":true,"is_shitlist":false,"is_enabled":true,"liq_is_active":true},{"id":550,"ticker":"busd","is_shortlist":true,"is_shitlist":false,"is_enabled":true,"liq_is_active":true},{"id":561,"ticker":"gbpb","is_shortlist":true,"is_shitlist":false,"is_enabled":true,"liq_is_active":false},{"id":579,"ticker":"gbp","is_shortlist":true,"is_shitlist":false,"is_enabled":true,"liq_is_active":false},{"id":607,"ticker":"usdct","is_shortlist":true,"is_shitlist":false,"is_enabled":true,"liq_is_active":false},{"id":763,"ticker":"husd","is_shortlist":false,"is_shitlist":false,"is_enabled":true,"liq_is_active":false},{"id":782,"ticker":"usdtrx","is_shortlist":true,"is_shitlist":false,"is_enabled":true,"liq_is_active":true},{"id":807,"ticker":"eurt","is_shortlist":false,"is_shitlist":false,"is_enabled":true,"liq_is_active":false},{"id":838,"ticker":"susd","is_shortlist":true,"is_shitlist":false,"is_enabled":true,"liq_is_active":false},{"id":866,"ticker":"chfb","is_shortlist":true,"is_shitlist":false,"is_enabled":true,"liq_is_active":false},{"id":921,"ticker":"fei","is_shortlist":false,"is_shitlist":false,"is_enabled":true,"liq_is_active":true},{"id":923,"ticker":"usdd","is_shortlist":true,"is_shitlist":false,"is_enabled":true,"liq_is_active":true},{"id":925,"ticker":"usdcpoly","is_shortlist":true,"is_shitlist":false,"is_enabled":true,"liq_is_active":true},{"id":934,"ticker":"usdcsol","is_shortlist":true,"is_shitlist":false,"is_enabled":true,"liq_is_active":true},{"id":935,"ticker":"usdcbsc","is_shortlist":true,"is_shitlist":false,"is_enabled":true,"liq_is_active":true},{"id":937,"ticker":"usdtbsc","is_shortlist":true,"is_shitlist":false,"is_enabled":true,"liq_is_active":true},{"id":938,"ticker":"usdtsol","is_shortlist":true,"is_shitlist":false,"is_enabled":true,"liq_is_active":true},{"id":971,"ticker":"usdcavac","is_shortlist":true,"is_shitlist":false,"is_enabled":true,"liq_is_active":true},{"id":972,"ticker":"usdtavac","is_shortlist":true,"is_shitlist":false,"is_enabled":true,"liq_is_active":true},{"id":973,"ticker":"usdctrx","is_shortlist":true,"is_shitlist":false,"is_enabled":true,"liq_is_active":true},{"id":974,"ticker":"euroc","is_shortlist":true,"is_shitlist":false,"is_enabled":true,"liq_is_active":true},{"id":1025,"ticker":"usdcxlm","is_shortlist":true,"is_shitlist":false,"is_enabled":true,"liq_is_active":true},{"id":1032,"ticker":"tusdavac","is_shortlist":true,"is_shitlist":false,"is_enabled":true,"liq_is_active":true},{"id":1033,"ticker":"tusdtrx","is_shortlist":true,"is_shitlist":false,"is_enabled":true,"liq_is_active":true},{"id":1034,"ticker":"tusdbsc","is_shortlist":true,"is_shitlist":false,"is_enabled":true,"liq_is_active":true},{"id":1049,"ticker":"usdtpoly","is_shortlist":true,"is_shitlist":false,"is_enabled":true,"liq_is_active":true},{"id":1051,"ticker":"daipoly","is_shortlist":true,"is_shitlist":false,"is_enabled":true,"liq_is_active":true},{"id":1071,"ticker":"pyusd","is_shortlist":true,"is_shitlist":false,"is_enabled":true,"liq_is_active":true},{"id":1100,"ticker":"usdcop","is_shortlist":true,"is_shitlist":false,"is_enabled":true,"liq_is_active":true},{"id":1118,"ticker":"usdcbase","is_shortlist":true,"is_shitlist":false,"is_enabled":true,"liq_is_active":true},{"id":1119,"ticker":"usdtxtz","is_shortlist":true,"is_shitlist":false,"is_enabled":true,"liq_is_active":true},{"id":1182,"ticker":"opusdt","is_shortlist":false,"is_shitlist":false,"is_enabled":true,"liq_is_active":true},{"id":1183,"ticker":"usdtarb","is_shortlist":false,"is_shitlist":false,"is_enabled":true,"liq_is_active":true},{"id":1186,"ticker":"daiarb","is_shortlist":false,"is_shitlist":false,"is_enabled":true,"liq_is_active":true},{"id":1190,"ticker":"daibsc","is_shortlist":false,"is_shitlist":false,"is_enabled":true,"liq_is_active":true},{"id":1192,"ticker":"usdcarb","is_shortlist":true,"is_shitlist":false,"is_enabled":true,"liq_is_active":true},{"id":1209,"ticker":"fdusd","is_shortlist":true,"is_shitlist":false,"is_enabled":true,"liq_is_active":true}]}

Promise.resolve().then(async () => {
    const logger = conf.newLogger('hello.log', {level: Levels.LevelDebug, console: true})
    logger.setLevel(Levels.LevelNotice)

    logger.warn(bigJson)

    for (const key in Levels) {
        const level = Levels[key]
        logger.log(level, 'Hello, Logr!')
    }

    logger.counter.inc('greeting')
    logger.info('Its Widget %s Bro!', conf.newCounter('crypto.log').snippet('max', 'price:BTC_USDT', 30))
    logger.counter.watchSystem()

    const delta = logger.counter.time('response')
    await sleep(1000)
    delta()
})


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
