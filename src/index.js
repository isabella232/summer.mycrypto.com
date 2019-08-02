
require('./styles/index.scss')

document.addEventListener("DOMContentLoaded", () => {

// GLOBAL

// TODO: Note to future self: change these each week!
const week2Available = false
const week3Available = false
const week4Available = false

let weekStep = 1

// ELEMENTS AND SHIT
const adventureBtnArrow     = document.getElementsByClassName('ab__btn-arrow')[0]
const adventureBtnBase      = document.getElementsByClassName('ab__btn-base')[0]
const adventureBtnComplete  = document.getElementsByClassName('ab__btn-complete')[0]
const adventureBtnContinue  = document.getElementsByClassName('ab__btn-continue')[0]
const adventureBtnStart     = document.getElementsByClassName('ab__btn-start')[0]
const characterChoiceBtn    = document.getElementsByClassName('character-choice__button')[0]
const characterWrapper      = document.getElementsByClassName('character__wrapper')[0]
const mapHighlight1         = document.getElementsByClassName('m__hover-1')[0]
const mapHighlight2         = document.getElementsByClassName('m__hover-2')[0]
const mapHighlight3         = document.getElementsByClassName('m__hover-3')[0]
const mapHighlight4         = document.getElementsByClassName('m__hover-4')[0]
const mapWeek2              = document.getElementsByClassName('map--2')[0]
const mapWeek3              = document.getElementsByClassName('map--3')[0]
const mapWeek4              = document.getElementsByClassName('map--4')[0]
const modal                 = document.getElementsByClassName('modal')[0]
const modalButton           = document.getElementsByClassName('modal__button')[0]
const modalClose            = document.getElementsByClassName('modal__close')[0]
const modalItem             = document.getElementsByClassName('modal__item')[0]
const modalText             = document.getElementsByClassName('modal__text')[0]
const nextWeekBtn           = document.getElementsByClassName('week-controls__next')[0]
const prevWeekBtn           = document.getElementsByClassName('week-controls__prev')[0]
const treasureAvailab       = document.getElementsByClassName('secret-treasure--available')[0]
const treasureClaimed       = document.getElementsByClassName('secret-treasure--flag')[0]
const treasureUnavail       = document.getElementsByClassName('secret-treasure--unavailable')[0]

const allCharItems          = document.querySelectorAll( '.character__wrapper .item')
const allClaimTreasureItems = document.querySelectorAll('[data-action="claim-treasure"]')
const allCurrentWeekSteps   = document.querySelectorAll('[data-weekstep="' + weekStep + '"]')
const allWeekButtons        = document.querySelectorAll( '.week__button')
const allWeekDots           = document.querySelectorAll('.week__dot')
const allWeekItems          = document.querySelectorAll('.week__item')
const allWeekSteps          = document.querySelectorAll('[data-weekstep]')

const allMapContents        = document.getElementsByClassName('map__inner')
const allMapHighlights      = document.getElementsByClassName('m__hover')


// Detect Brave
const ua         = window.navigator.userAgent.toLowerCase()
const isChrome   = /chrome|crios/.test(ua) && ! /edge|opr\//.test(ua)
const hasPlugins = navigator.plugins.length > 0
var isBrave

const testForAdBlocker = function(callback) {
    const img = new Image
    img.onload = function() {
        callback(true)
    }
    img.onerror = function() {
        callback(false)
    }
    img.src = 'https://mycrypto.com/&showad=TEST_URL_TO_CHECK_FOR_BRAVE_AD_BLOCKING'
}

testForAdBlocker(function( blocksAds ) {
    if(isChrome) {                                            // chrome ua narrows to brave and chrome
        if(!hasPlugins) {                                     // chrome desktop always has plugins. narrows to brave and chrome mobile
            if(blocksAds) {                                   // chrome mobile doesnt block ads. narrows to brave
                localStorage.setItem("isUsingBrave", true)
                isBrave = true
                if (document.body.classList.contains('home')) unburyTreasure()
                  _paq.push(['trackEvent', 'isBrave', 'true']);
            } else {
                localStorage.setItem("isUsingBrave", false)
                isBrave = false
                if (document.body.classList.contains('home')) unburyTreasure()
                  _paq.push(['trackEvent', 'isBrave', 'false']);
            }
        } else {
            localStorage.setItem("isUsingBrave", false)
            isBrave = false
            if (document.body.classList.contains('home')) unburyTreasure()
              _paq.push(['trackEvent', 'isBrave', 'false']);
        }
    } else {
        localStorage.setItem("isUsingBrave", false)
        isBrave = false
        if (document.body.classList.contains('home')) unburyTreasure()
          _paq.push(['trackEvent', 'isBrave', 'false']);
    }
})


// get local storage values
let latestAvailableWeek = 1
let latestUserWeek      = localStorage.getItem('latestUserWeek') > 0 ? JSON.parse(localStorage.getItem('latestUserWeek')) : 0
let characterChoice     = localStorage.getItem('characterChoice') === 'male' ? 'male' : 'female'

const itemKeys = ['item__1-1', 'item__1-2', 'item__1-3', 'item__2-1', 'item__2-2', 'item__2-3', 'item__3-1', 'item__3-2', 'item__3-3', 'item__4-1', 'item__4-2', 'item__4-3'];
itemKeys.forEach( item => {
    if(JSON.parse( localStorage.getItem(item) )) {
        let weekNum = item.slice(6,7)
        let itemNum = item.slice(8,9)
        let persist = false
        selectItem(weekNum, itemNum, persist)
        _paq.push([ 'trackEvent', 'Item In Local Storage', weekNum + '-' + itemNum ])
    }
})

// set local storage values
localStorage.setItem("latestAvailableWeek", latestAvailableWeek)
localStorage.setItem("latestUserWeek", latestUserWeek)
_paq.push([ 'trackEvent', 'Latest Available Week', latestAvailableWeek ])
_paq.push([ 'trackEvent', 'Latest User Week', latestUserWeek ])


// ON EVENTS

// onload: choose character based on local storage
chooseCharacter( characterChoice )

// onload: display the stuff for the current week
displayMap( latestUserWeek + 1 )

// onload: fill in recent weeks

// onload: change the adventure bar to have the users curent week
if(adventureBtnBase) updateAdventureBar( latestUserWeek )
if(week2Available && mapWeek2) mapWeek2.classList.add("state--available")
if(week3Available && mapWeek3) mapWeek3.classList.add("state--available")
if(week4Available && mapWeek4) mapWeek4.classList.add("state--available")

// update home button on click
let newWeek = parseInt(latestUserWeek) + 1
if(adventureBtnBase) {
    adventureBtnBase.addEventListener('click', function(){
      window.location="week-"+newWeek+".html"
      _paq.push([ 'trackEvent', 'Clicked: Adventure Button', newWeek ]);
    } )
    adventureBtnBase.classList.add("state--week-" + newWeek)

  if(week2Available || newWeek===2) adventureBtnBase.classList.add("state--unavailable")
  if(week3Available || newWeek===3) adventureBtnBase.classList.add("state--unavailable")
  if(week4Available || newWeek===4) adventureBtnBase.classList.add("state--unavailable")

}



// onclick: change female <> male
if(characterChoiceBtn) characterChoiceBtn.addEventListener('click', toggleCharacter)

// onclick: display different stuff on map
if(mapHighlight1) mapHighlight1.addEventListener('click', function(){ displayMap(1) } )
if(mapHighlight2) mapHighlight2.addEventListener('click', function(){ displayMap(2) } )
if(mapHighlight3) mapHighlight3.addEventListener('click', function(){ displayMap(3) } )
if(mapHighlight4) mapHighlight4.addEventListener('click', function(){ displayMap(4) } )

// onclick: have primary home button go to most recent page
if(characterChoiceBtn) characterChoiceBtn.addEventListener('click', toggleCharacter)

// onclick: claim their treasure if they are on brave
allClaimTreasureItems.forEach((item) => {
  item.addEventListener('click', () => {
    if( isBrave ) {
        treasureAvailab.style.display = 'none'
        treasureUnavail.style.display = 'none'
        treasureClaimed.style.display = 'block'
        localStorage.setItem("claimedTreasure", true)
        showSuccessModal('brave','flag')
        _paq.push([ 'trackEvent', 'Claimed Brave Treasure', 'true' ]);

    }
  })
})

if(allWeekItems) {
    allWeekItems.forEach(weekItem => {
        weekItem.addEventListener('mouseover', function(){ selectItem( 1, this.getAttribute('data-item'), false, this.getAttribute('data-href') ) })
    })
    allWeekItems.forEach(weekItem => {
        weekItem.addEventListener('click', function(){ selectItem( 1, this.getAttribute('data-item'), false, this.getAttribute('data-href') ) })
    })
    allWeekButtons.forEach(weekButton => {
        weekButton.addEventListener('click', function(){ selectItem( 1, this.getAttribute('data-item'), true, this.getAttribute('data-href') ) })
    })
}

// set the initial state of the week page
if (allWeekSteps[0]) selectWeekStep(weekStep)

if(allWeekDots) {
    allWeekDots.forEach(weekDot => {
        weekDot.addEventListener('click', function(){ selectWeekStep( this.getAttribute('data-weekstep')) })
    })
}





// FUNCTIONS

// toggles the characters gender
function toggleCharacter() {
    let femaleSelected = document.querySelectorAll('.character__wrapper[data-state="female-selected"]')[0]
    if ( femaleSelected )
        chooseCharacter('male')
    else
        chooseCharacter('female')
}

// changes the characters gender
function chooseCharacter(gender) {
    let oppositeGender= (gender==='female') ? 'male' : 'female'
    localStorage.setItem('characterChoice', gender)
    characterWrapper.setAttribute('data-state', gender+'-selected')
    _paq.push([ 'trackEvent', 'Chose Character', gender ]);
}

// changes adventure map to show each week
function displayMap(weekNumber) {
    if (weekNumber > 4) weekNumber = 4
    for (var i = 0 ; i < allMapContents.length ; i++) {
        if ( allMapContents[i].classList.contains('map--'+weekNumber) ) {
            allMapContents[i].classList.add('state--selected')
            allMapHighlights[i].classList.add('state--selected')
        } else {
            allMapContents[i].classList.remove('state--selected')
            allMapHighlights[i].classList.remove('state--selected')
        }
    }
    _paq.push([ 'trackEvent', 'Clicked Map Week', weekNumber ]);
}

function updateAdventureBar(latestUserWeek) {
    for (var i = 1 ; i <= latestUserWeek ; i++) {
        // i is week 1, week 2, etc up until the users current week
        for (var j = 0 ; j < document.querySelectorAll('.ab__complete--'+i).length ; j++) {
            document.querySelectorAll('.ab__complete--'+i)[j].style.display = 'block'
        }
    }
    adventureBtnComplete.style.display = 'none'
    adventureBtnContinue.style.display = 'none'
    adventureBtnStart.style.display = 'none'
    if (latestUserWeek >= 4) {
        adventureBtnComplete.style.display = 'block'
        adventureBtnArrow.style.display = 'none'
    } else if (latestUserWeek >= 1 && latestUserWeek < 4) {
        adventureBtnContinue.style.display = 'block'
        adventureBtnArrow.style.display = 'block'
    } else {
        adventureBtnStart.style.display = 'block'
        adventureBtnArrow.style.display = 'block'
    }
}

function unburyTreasure() {
    treasureAvailab.style.display = 'none'
    treasureUnavail.style.display = 'none'
    treasureClaimed.style.display = 'none'
    if ( JSON.parse(localStorage.getItem("claimedTreasure")) ) {
        treasureClaimed.style.display = 'block'
        _paq.push([ 'trackEvent', 'Treasure State', 'Claimed' ]);
    } else if ( isBrave ) {
        treasureAvailab.style.display = 'block'
        _paq.push([ 'trackEvent', 'Treasure State', 'Available' ]);
    } else if ( JSON.parse(localStorage.getItem("isUsingBrave")) ) {
        treasureAvailab.style.display = 'block'
        _paq.push([ 'trackEvent', 'Treasure State', 'Available' ]);
    } else {
        treasureUnavail.style.display = 'block'
        _paq.push([ 'trackEvent', 'Treasure State', 'Unavailable' ]);
    }
}

function selectWeekStep(num) {

    num = parseInt(num)
    let weekStep = num

    allWeekSteps.forEach((item) => {
        if( item.getAttribute('data-weekstep')==num ) {
            item.setAttribute('data-state', 'selected')
        } else {
            item.removeAttribute('data-state')
        }
    })

    if (num-1 > 0) {
        prevWeekBtn.addEventListener('click', function(){ selectWeekStep( num-1 ) })
        prevWeekBtn.style.opacity = 1
    } else {
        prevWeekBtn.style.opacity = 0
    }

    if (num+1 <= allWeekDots.length) {
        nextWeekBtn.addEventListener('click', function(){ selectWeekStep( num+1 ) })
        nextWeekBtn.style.opacity = 1
    } else {
        nextWeekBtn.style.opacity = 0
    }

    _paq.push([ 'trackEvent', 'Week: Selected Step', num ]);

}


function selectItem(weekNum, itemNum, persist, successURL) {
    weekNum = parseInt(weekNum)
    itemNum = parseInt(itemNum)
    successURL = successURL ? successURL : "#"
    let itemClass = 'item__' + weekNum + '-' + itemNum

    _paq.push([ 'trackEvent', 'Item: Hover', weekNum + '-' + itemNum ]);

    document.querySelector( '.character__wrapper .item__' + weekNum + '-1').style.opacity = 0
    document.querySelector( '.character__wrapper .item__' + weekNum + '-2').style.opacity = 0
    document.querySelector( '.character__wrapper .item__' + weekNum + '-3').style.opacity = 0
    document.querySelectorAll( '.character__wrapper .' + itemClass )[0].style.opacity = 1

    if(persist) {
        localStorage.setItem('item__' + weekNum + '-1', false)
        localStorage.setItem('item__' + weekNum + '-2', false)
        localStorage.setItem('item__' + weekNum + '-3', false)
        localStorage.setItem(itemClass, true)
        showSuccessModal(weekNum, itemNum, successURL)
        _paq.push([ 'trackEvent', 'Item: Selected', weekNum + '-' + itemNum ]);
    }

}


function showSuccessModal(weekNum, itemNum, successURL) {

    let itemImages = {
        "item11"        : require('./assets/item__1-1.svg'),
        "item12"        : require('./assets/item__1-2.svg'),
        "item13"        : require('./assets/item__1-3.svg'),
        "item21"        : require('./assets/item__2-1.svg'),
        "item22"        : require('./assets/item__2-2.svg'),
        "item23"        : require('./assets/item__2-3.svg'),
        "itembraveflag" : require('./assets/item__brave-flag.svg')
    }
    let itemClass = 'item__' + weekNum + '-' + itemNum
    let imgKey = 'item' + weekNum + itemNum

    modalItem.src = itemImages[imgKey]

    switch ( itemClass ) {
        case 'item__brave-flag':
            modalText.innerHTML = 'You’ve received the <strong>bonus Brave flag!</strong> Thanks for using the Brave Browser!'
            modalButton.href= 'https://twitter.com/intent/tweet?text=I%20just%20scored%20a%20special%20item%20on%20%23MyCryptoSummer%20because%20I%20use%20%40Brave%20for%20all%20my%20browsing!%20Start%20your%20adventure%20and%20win%20prizes%20now%20at%20https%3A%2F%2Fsummer.mycrypto.com!%20%40MyCrypto'
            _paq.push([ 'trackEvent', 'Item: Saw Modal', weekNum + '-' + itemNum ]);
            break;
        case 'item__1-1':
            modalText.innerHTML = 'You received the <strong>Pirate Hat</strong> for selecting the <strong>Download Brave Browser</strong> option!'
            modalButton.href = 'https://twitter.com/intent/tweet?text=Arrr!%20I%20got%20me%20pirate%20hat%20t%27%20set%20sail%20%27n%20start%20th%27%20%23MyCryptoSummer%20journey!%20Begin%20yer%20adventure%20now%20%27n%20win%20prizes%20at%20https%3A%2F%2Fsummer.mycrypto.com!%20%40MyCrypto'
            _paq.push([ 'trackEvent', 'Item: Saw Modal', weekNum + '-' + itemNum ]);
            break;
        case 'item__1-2':
            modalText.innerHTML = 'You received the <strong>Snorkel</strong> for selecting the <strong>Earn with Coinbase</strong> option!'
            modalButton.href = 'https://twitter.com/intent/tweet?text=I%E2%80%99m%20ready%20to%20explore%20the%20%23MyCryptoSummer%20world%20with%20my%20new%20snorkel!%20Start%20your%20adventure%20now%20and%20win%20prizes%20at%20https%3A%2F%2Fsummer.mycrypto.com!%20%40MyCrypto'
            _paq.push([ 'trackEvent', 'Item: Saw Modal', weekNum + '-' + itemNum ]);
            break;
        case 'item__1-3':
            modalText.innerHTML = 'You received the <strong>Umbrella Hat</strong> for selecting the <strong>Read EthHub</strong> option!'
            modalButton.href = 'https://twitter.com/intent/tweet?text=I%E2%80%99m%20on%20my%20way%20to%20discovering%20The%20Land%20Of%20Magical%20Internet%20Money%20with%20my%20trusty%20Umbrella%20Hat%2C%20thanks%20to%20%23MyCryptoSummer!%20Start%20your%20adventure%20now%20at%20https%3A%2F%2Fsummer.mycrypto.com%20%40MyCrypto%0A'
            _paq.push([ 'trackEvent', 'Item: Saw Modal', weekNum + '-' + itemNum ]);
            break;
    }

    modal.classList.add('open');

    localStorage.setItem("latestUserWeek", weekNum)
    _paq.push([ 'trackEvent', 'Latest User Week', weekNum ]);

    if (successURL != undefined && successURL != "#") {
        var newTab = window.open(successURL, '_blank');
        newTab.opener = null;
    }

}

modalClose.addEventListener('click', function() { closeModal() })

function closeModal() {
    modal.classList.remove('open');
    _paq.push([ 'trackEvent', 'Closed Modal via X', true ]);
}

})

