const pb = new PocketBase("https://psqsharedb.psqsoft.org")

pb.authStore.loadFromCookie(document.cookie)
if (pb.authStore.baseModel == null) {
    pb.authStore.clear()
    window.location = "/"
}

const quill = new Quill("#editor", {
    theme: "bubble",
    modules: {
        toolbar: [
            [{ 'header': 1 }, { 'header': 2 }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['link'],
            ['blockquote', 'code-block'],
            ['clean']
        ]
    }
})

async function postArticle() {

    const data = new FormData()

    let name = document.getElementById("articleTitle").value

    if (name == "" || name == null) return

    data.append("name", name)
    data.append("content", quill.getSemanticHTML())
    data.append("author", pb.authStore.baseModel.id)

    await pb.collection("articles").create(data)

    window.location = "/"
}