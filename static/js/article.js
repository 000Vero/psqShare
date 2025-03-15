const pb = new PocketBase("https://psqsharedb.psqsoft.org")

var data

async function fetchArticle() {
    const id = window.location.pathname.replace("/article/", "")

    try {
        data = await pb.collection("articles").getOne(id)

        let author = await pb.collection("users").getOne(data.author)

        document.getElementById("loadingBar").style.display = "none"

        document.getElementById("pageTitle").innerText = document.getElementById("articleTitle").innerText = data.name;

        document.getElementById("articleBody").innerHTML = data.content

        document.getElementById("author").innerText = author.name

    } catch {
        window.location = "/"
    }

    tryLogin()

}

function tryLogin() {
    pb.authStore.loadFromCookie(document.cookie)
    if (pb.authStore.baseModel == null) {
        pb.authStore.clear()
        return
    }
    
    if (data.author == pb.authStore.baseModel.id) {
        document.getElementById("delete").style.display = "block"
    }

}

async function deleteArticle() {
    await pb.collection("articles").delete(data.id)

    window.location = "/"
}

fetchArticle()