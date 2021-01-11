const Sonus = require('sonus')
const speech = require('@google-cloud/speech')
const client = new speech.SpeechClient()

const hotwords = [{ file: 'resources/snowboy.umdl', hotword: 'snowboy' }]
const sonus = Sonus.init({ hotwords }, client)

Sonus.start(sonus)
sonus.on('hotword', (index, keyword) => console.log("!"))
sonus.on('final-result', console.log)
