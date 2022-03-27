
form.onsubmit = async (event) => {
    event.preventDefault();

    let res = await fetch('/word')
    res = await res.json()
    if (res.message == "start") {
        return alert("O'yin allaqochon boshlangan iltimos biroz kuting")
    }
    

    let username = usernameInput.value.trim()
    let image = fileInput.files[0]

    let formData = new FormData()
	formData.append('username', username)
	formData.append('file', image)

    

    if (!username || !image) return alert("Username yoki rasm kiritilmagan!")
    if (
        image.type.toLowerCase() == "image/png" || 
        image.type.toLowerCase() == "image/jpeg" || 
        image.type.toLowerCase() == "image/jpg" ||
        image.type.toLowerCase() == "image/jfif" || 
        image.type.toLowerCase() == "image/pjpeg" ||
        image.type.toLowerCase() == "image/pjp" ||
        image.type.toLowerCase() == "image/svg"
    ){
        let response = await fetch('/', {
            method: 'POST',
            body: formData
        })
        
    }else return alert("Rasm turi faqat JPEG, JPG, PNG bo'lishi kerak")
    window.location = '/game'
    
}


