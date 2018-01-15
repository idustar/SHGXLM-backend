function checktitles(titles, my = "") {
    let mys = my.split(',')
    if (!titles.length) return true
    let t = titles.split(',')

    return mys.some(e => t.some(ee => parseInt(ee) === parseInt(e)))
}

module.exports = { checktitles }



