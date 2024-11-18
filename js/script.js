// On page load
document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    var index = document.getElementsByClassName("index")[0];
    var menu = index.getElementsByClassName("menu")[0];

    var search_ind = document.getElementsByClassName("search-indicator")[0];
    var search_els = search_ind.getElementsByTagName("p");
    var search_prev = search_els[0];
    var search_num = search_els[1];
    var search_next = search_els[2];

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
    var search_results = undefined;
    var search_curr_index = 0;

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
            search_results = fuse.search(value);
            // Get all results, in order of ocurrence
            // search_results.sort(function(a, b) {
                // return b.refIndex - a.refIndex;
            // });
            // This will sort by higher refIndex first
            if (search_results.length > 0) {
                var [bestMatch] = search_results;
                var index = search_results.indexOf(bestMatch);
                var id = bestMatch.item.title;

                search_curr_index = index;

                window.location.hash = id;
                search_num.innerText = String(search_curr_index + 1) + "/" + String(search_results.length);
                // Slide the browser to the best match id
            }
        }
    });

    search_num.addEventListener("click", function(event) {
        if (search_results != undefined) {
            id = search_results[search_curr_index].item.title;
            window.location.hash = id;
        }
    });

    search_prev.addEventListener("click", function(event) {
        if (search_results != undefined && search_curr_index > 0) {
            search_curr_index--;
            id = search_results[search_curr_index].item.title;
            window.location.hash = id;
            search_num.innerText = String(search_curr_index + 1) + "/" + String(search_results.length);
        }
    });

    search_next.addEventListener("click", function(event) {
        if (search_results != undefined && search_curr_index < search_results.length - 1) {
            search_curr_index++;
            id = search_results[search_curr_index].item.title;
            window.location.hash = id;
            search_num.innerText = String(search_curr_index + 1) + "/" + String(search_results.length);
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
