// On page load
document.addEventListener('DOMContentLoaded', function() {
    // Get the index element
    var index = document.getElementsByClassName("index")[0];
    var menu = index.getElementsByClassName("menu")[0];

    // Get the list of section titles
    var titles_els = document.getElementsByClassName("title");

    // Loop through the titles and add them to the menu
    for (var i = 0; i < titles_els.length; i++) {
        var title = titles_els[i].innerText;
        var id = titles_els[i].parentElement.id;

        var li = document.createElement("li");
        var a = document.createElement("a");
        a.href = "#" + id;
        a.innerText = title;
        li.appendChild(a);
        menu.appendChild(li);
    }

    // Add a click event handler to the index element
    index.addEventListener("click", function() {
        // Toggle the display of the index element
        menu.style.display = menu.style.display === "none" ? "block" : "none";
    });

    // ------------ INDEX ------------

    var fuse = undefined;
    // Out of function to access it later

    fetchDocument("/js/manual.json").then(data => {
        documentData = data;

        // Configure Fuse.js
        fuse = new Fuse(documentData, {
            keys: ["title", "content"], // Buscar en el contenido
        });
    });

    var browser_el = document.getElementsByClassName("browser")[0];
    browser_el.addEventListener("keyup", function(event) { 
        if (event.key === "Enter") {
            // Get the value of the input browser
            var value = browser_el.getElementsByTagName("input")[0].value;
            var results = fuse.search(value);
            // Slide the browser to the best match id
            if (results.length > 0) {
                var [bestMatch] = results;
                var index = bestMatch.refIndex;
                var id = bestMatch.item.title;

                window.location.hash = id;
            }
        }
    });

    // ------------ SEARCH INDICATOR ------------
});

function fetchDocument(doc_path) { 
    return fetch(doc_path)
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            return res.json();
        })
        .catch(error => {
            console.error("Unable to fetch data:", error);
            return null;
        });
}
