'use strict'

const mql = require('@microlink/mql')
const download = require('download')
const pAll = require('p-all')

const TARGET_URL = 'http://spongebob.wikia.com/wiki/List_of_time_cards'

const main = async () => {
  const { data } = await mql(TARGET_URL, {
    rules: {
      timecards: {
        selectorAll: 'td > a.image',
        attr: 'href',
        type: 'url'
      }
    }
  })

  const { timecards } = data

  let count = 0

  const toDownload = timecards.map(url => () => {
    console.log(++count, url)
    return download(url, 'static')
  })
  await pAll(toDownload, { concurrency: 4 })
  return timecards.length
}

main()
  .then(size => {
    console.log(`\nDone! ${size} ✨`)
    process.exit()
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
