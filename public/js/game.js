const selectedUser = document.querySelector(".selected-user__title")
const timecount = document.querySelector(".word-timer")
const gamePlace = document.querySelector(".gamePlace")
const userList = document.querySelector(".users-list")
const word = document.querySelector(".word-input")
const resetBtn = document.querySelector(".reset")
const startBtn = document.querySelector(".btn")
let timer = null
let users = []
let countUsers = 1
let user = ''
let oldWord = ''
let starter = false



function* gen(params) {
    let stuff = ''
    for (const param of params) {
        yield stuff = param
    }
}


function createElements(...array) {
    return array.map(el => document.createElement(el))
}


async function getUser() {
    let len = 0
    timer = setInterval(async() => {
        let response = await fetch('/users')
        users = await response.json()
        
        if (len < users.length || len > users.length) {
            userList.textContent = ''
            len = users.length

            for (const user of users) {
                let [li, div1, img, div2, span, div3] = createElements("li", "div", "img", "div", "span", "div")
                li.classList.add("users-list__item")
                div1.classList.add("user-img")
                img.classList.add("img")
                img.src =user.proFileImage
                img.width = 45
                img.alt = ""
                div1.append(img)
                div2.classList.add("user-name")
                span.textContent = user.username
                div2.append(span)
                div3.classList.add("user-status")
                div3.textContent = "online"
                li.append(div1, div2, div3)
                userList.append(li)
                turn(countUsers)
            }
        }
    }, 1000);
}


async function turn() {

    let res = await fetch('/word')
    res = await res.json()
    if (res.message == "start" && users.length == 1) {
        let res = fetch('/word', {
            method: 'DELETE'
        })
        return alert(`${users[0].username} TABRIKLAYMIZ SIZ YUTDINGIZ!!!`)
        
    }


    let navbat = gen(users)
    if (users.length < countUsers) {
        countUsers = 1
    }
    
    for (let i = 0; i < countUsers; i++) {
        user = navbat.next().value
        
    }


    // let count = 10
    // let myInterval = setInterval(() => {
    //     if (count > 0) {
    //         timecount.textContent = '00:' + (count -= 1)

    //     }else{
    //         clearInterval(myInterval)
    //         // turn(countUsers += 1)
    //     }
    // }, 1400);


    gamePlace.textContent = ''
    let [div1, div2, img, div3, div4, input] = createElements("div", "div", "img", "div", "div", "input")
    div1.classList.add("selected-user")
    div2.classList.add("selected-user__img")
    img.classList.add("img")
    img.src = user.proFileImage
    img.width = 70
    img.alt = ""
    div3.classList.add("selected-user__title")
    div3.textContent = user.username

    div2.append(img)
    div4.append(input)
    div1.append(div2, div3)
    gamePlace.append(div1)

}


startBtn.onclick = (event) => {
    console.log("start");
    starter = true
}


resetBtn.onclick = (event) => {
    console.log("reset");
    let res = fetch('/word', {
        method: 'DELETE'
    })
    starter = false
}


word.onkeyup = async (event) => {
    if (event.keyCode == 13) {

        if (starter) {
            
            let newWord = word.value.trim().toLowerCase()
            word.value = ""
    
            if (!newWord) {
                return alert('Empty input')
            }
    
            let response = fetch('/word', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: user.userId,
                    username: user.username,
                    newWord
                })
            })
    
            let javob = await response
            if(javob.status == 404){
                let res = fetch('/users', {
                    method: 'DELETE',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                    userId: user.userId,
                    username: user.username
                    })
                })
                alert(`${user.username} siz ${oldWord.toUpperCase()} so'zining oxirgi harfiga so'z kiritishingiz kerak edi. Lekin siz ${newWord.toUpperCase()} so'zini kiritdingiz va YUTQAZDINGIZ`)
            }
            oldWord = newWord
            if(javob.status != 404){
                turn(countUsers += 1)
            }
        }

        
    }
}








getUser()

