const pb = new PocketBase("http://127.0.0.1:8090")

const notificationTemplate = `
<div class="notification is-notification_type">
    <button class="delete"></button>
    notification_content
</div>
`

async function loginUser(email, password) {
    
    let notification = notificationTemplate

    try {
        await pb.collection("users").authWithPassword(email, password)
        
        notification = notification.replace("notification_type", "success")
        notification = notification.replace("notification_content", "Login effettuato con successo!")

        document.getElementById("create").style.display = "block"
        document.getElementById("logout").style.display = "block"
        document.getElementById("login").style.display = "none"

    } catch {

        notification = notification.replace("notification_type", "danger")
        notification = notification.replace("notification_content", "Errore durante il login, controlla le credenziali")

    }
    
    document.getElementById("articleList").innerHTML += notification

    document.querySelectorAll('.notification .delete').forEach(($delete) => {
        const $notification = $delete.parentNode;
    
        $delete.addEventListener('click', () => {
          $notification.parentNode.removeChild($notification);
        });
    });

    

    let cookie = pb.authStore.exportToCookie({
        httpOnly: false
    })

    document.cookie = cookie
}

function loginFromCookie() {
    pb.authStore.loadFromCookie(document.cookie)
    if (pb.authStore.baseModel == null) pb.authStore.clear()
    else {
        document.getElementById("create").style.display = "block"
        document.getElementById("logout").style.display = "block"
        document.getElementById("login").style.display = "none"
    }
}

async function loginFromModal() {
    document.querySelectorAll('.notification').forEach((elem) => {
        elem.remove()
    })

    let email = document.getElementById("email").value
    let password = document.getElementById("password").value
    await loginUser(email, password)
}

function logout() {

    pb.authStore.clear();

    let cookie = pb.authStore.exportToCookie({
        httpOnly: false
    })

    document.cookie = cookie

    document.getElementById("create").style.display = "none"
    document.getElementById("logout").style.display = "none"
    document.getElementById("login").style.display = "block"
}

function editor() {
    window.location = "/editor"
}

async function displayArticles() {

    let path = window.location.pathname.replaceAll("/", "").replace("articles", "")

    let base = parseInt(path)

    const limit = await pb.collection("articles").getList(1, 1)

    if (isNaN(base) || base <= 0 || base == null || base > limit.totalPages) base = 1
    
    const data = await pb.collection("articles").getList(base, 20, {
        sort: "-created"
    })

    document.getElementById("loadingBar").style.display = "none"

    if (base == 1) {
        document.getElementById("previous").style.display = "none"
    }

    document.getElementById("previous").innerText = base - 1
    document.getElementById("previous").href = "/articles/" + String(base - 1)

    document.getElementById("current").innerText = base
    document.getElementById("current").href = "/articles/" + String(base)

    if (data.totalPages < base + 1) document.getElementById("next").style.display = "none"

    document.getElementById("next").innerText = base + 1
    document.getElementById("next").href = "/articles/" + String(base + 1)

    const parentElement = document.getElementById("articleList")

    const elementTemplate = `
    <li class="article">
        <div class="card">
            <div class="card-content">
                <p class="title">name</p>
                <p class="subtitle">author - date</p>
            </div>
            <footer class="card-footer">
                <p class="card-footer-item">
                    <span>Leggi <a href="/article/id">questo articolo</a></span>
                </p>
            </footer>
        </div>
    </li>
    `

    for (let article of data.items) {
        const author = await pb.collection("users").getOne(article.author)


        let newTemplate = elementTemplate;
        newTemplate = newTemplate.replace("name", article.name)
        newTemplate = newTemplate.replace("date", article.created.substring(0, 10))
        newTemplate = newTemplate.replace("id", article.id)
        newTemplate = newTemplate.replace("author", author.name)

        parentElement.innerHTML += newTemplate;
    }

    if (limit.totalPages > 0) document.getElementsByClassName("pagination")[0].style.display = "block"
}

displayArticles()

loginFromCookie()
