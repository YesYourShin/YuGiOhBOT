
const {createCanvas, loadImage} = require('canvas')

const CARD_WIDTH = 694
const CARD_HEIGHT = 1013

const ART_X = 85
const ART_Y = 187
const ART_WIDTH = 526
const ART_HEIGHT = 528

const NAME_X = 56
const NAME_Y = 76
const NAME_SIZE = 48
const NAME_WIDTH = CARD_WIDTH - NAME_X*2

const ATTR_WIDTH = 56
const ATTR_HEIGHT = 56
const ATTR_X = CARD_WIDTH - 56 - ATTR_WIDTH
const ATTR_Y = NAME_Y + 4 - ATTR_HEIGHT/2

const LEVEL_WIDTH = 40
const LEVEL_HEIGHT = 40
const LEVEL_X = CARD_WIDTH - 64
const LEVEL_Y = 128

const TITLE_X = 64
const TITLE_Y = 768
const TITLE_SIZE = 24

const TEXT_X = TITLE_X
const TEXT_Y = TITLE_Y

const BACKGROUNDS = {
    'standard': 'res/standard-monster.png',
    'effect': 'res/effect-monster.png',
    'ritual': 'res/ritual-monster.png',
    'fusion': 'res/fusion-monster.png',
    'magic': 'res/magic.png',
    'trap': 'res/trap.png',
}

const ATTRIBUTES = {
    '어둠': 'res/dark.png',
    '신': 'res/divine.png',
    '땅': 'res/earth.png',
    '불': 'res/fire.png',
    // '빛': 'res/light.png',
    '물': 'res/water.png',
    '바람': 'res/wind.png',
}

const generateCard = async (data) => {
    const {name, text, type, artPath, level, attribute, monsterType, magicTrapType,
            nameStyle, textSize} = data
    const background = await loadImage(BACKGROUNDS[type])
    const art = await loadImage(artPath)
    
    const canvas = createCanvas(CARD_WIDTH, CARD_HEIGHT)
    const ctx = canvas.getContext('2d')

    ctx.drawImage(background, 0, 0, CARD_WIDTH, CARD_HEIGHT)
    const artSrcWidth = (art.width > art.height) ? ART_WIDTH / ART_HEIGHT * art.height : art.width
    const artSrcHeight = (art.height > art.width) ? ART_HEIGHT / ART_WIDTH * art.width : art.height
    const artSrcX = (art.width - artSrcWidth) / 2
    const artScrY = (art.height - artSrcHeight) / 2
    ctx.drawImage(art, artSrcX, artScrY, artSrcWidth, artSrcHeight, ART_X, ART_Y, ART_WIDTH, ART_HEIGHT)

    ctx.font = `bold ${NAME_SIZE}px Noto Serif CJK KR`
    ctx.textBaseline = 'middle'
    ctx.fillStyle = nameStyle || 'black'
    ctx.fillText(name, NAME_X, NAME_Y, NAME_WIDTH)

    if(attribute) ctx.drawImage(await loadImage(ATTRIBUTES[attribute]), ATTR_X, ATTR_Y, ATTR_WIDTH, ATTR_HEIGHT)
    if(level) {
        const image = await loadImage('res/level.png')
        for(let i = 1; i <= level; i++) {
            ctx.drawImage(image, LEVEL_X - i*(LEVEL_WIDTH+4), LEVEL_Y, LEVEL_WIDTH, LEVEL_HEIGHT)
        }
    }

    if(monsterType) {
        ctx.font = `bold ${TITLE_SIZE}px Noto Serif CJK KR`
        ctx.textBaseline = 'top'
        ctx.fillStyle = 'black'
        ctx.fillText(monsterType, TITLE_X, TITLE_Y)
    }

    ctx.font = `${textSize || 24}px Noto Serif CJK KR`
    ctx.textBaseline = 'top'
    ctx.fillStyle = 'black'
    ctx.fillText(text, TEXT_X, TEXT_Y + (monsterType ? TITLE_SIZE+12 : 0))

    return canvas.toBuffer()
}

module.exports = {generateCard}
