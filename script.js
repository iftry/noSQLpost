const form = document.getElementById("tree-form");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const treeData={
        name: document.getElementById("create-name").value,
        height: document.getElementById("create-height").value,
        type: document.getElementById("create-type").value,
    };

    fetch("http://127.0.0.1:3000/medziai", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(treeData),
    })
    .then((response) => {
        response.json();
    })
    .then((resp) => {
        form.reset();
    })
    .catch((err) => {
        console.log(err.message);
    });
});