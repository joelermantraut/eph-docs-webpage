// On page load
document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    var index = document.getElementsByClassName("index")[0];
    var menu = index.getElementsByClassName("menu")[0];

    var search_ind = document.getElementsByClassName("search-indicator")[0];
    var search_btns = search_ind.getElementsByTagName("button");
    var search_num = search_ind.getElementsByTagName("span")[0];
    var search_close = search_btns[0];
    var search_prev = search_btns[1];
    var search_next = search_btns[2];

    // Get the list of section titles
    var titles_els = document.querySelectorAll(".section .title");

    /*
    titles_els.forEach(title => {
        title.addEventListener('click', () => {
            const section = title.parentElement;
            if (section.classList.contains('hidden')) {
                // slideSection(section);
                slideSection(section);
            } else {
                slideUp(section);
            }
        });
      });
      */

    // Loop through the titles and add them to the menu
    for (var i = 0; i < titles_els.length; i++) {
        var title = titles_els[i].innerText;
        var id = titles_els[i].parentElement.id;

        if (!(titles_els[i].tagName === "H1" || titles_els[i].tagName === "H2"))
            continue;
        // Not include all titles because there are too many

        var li = document.createElement("li");
        var a = document.createElement("a");
        a.href = "#" + id;
        a.innerText = title;
        li.appendChild(a);
        menu.appendChild(li);
    }

    var menu_links = menu.querySelectorAll("a");
    menu_links.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();

            objetive_element = document.getElementById(link.href.split('#')[1]);
            slideSection(objetive_element);
            
            window.location.hash = link.href.split('#')[1];
            // Removes # from url and scrolls to the section
        });
      });

    // Add a click event handler to the index element
    index.addEventListener("click", function() {
        menu.classList.toggle("hidden");
    });

    // collapseAllSections();

    // ------------ INDEX ------------

    var fuse = undefined;
    // Out of function to access it later
    var search_results = undefined;
    var search_curr_index = 0;
    var browser_el = document.getElementsByClassName("browser")[0];
    var MANUAL_PATH = "/js/" + browser_el.id + ".json";
    // This defines json data filename in js folder

    fetchDocument(MANUAL_PATH).then(data => {
        documentData = data;

        // Configure Fuse.js
        fuse = new Fuse(documentData, {
            keys: ["title", "content"], // Buscar en el contenido
        });
    });

    browser_el.addEventListener("keyup", function(event) { 
        if (event.key === "Enter") {
            // Get the value of the input browser
            var value = browser_el.getElementsByTagName("input")[0].value;
            search_results = fuse.search(value);
            // Get all results, in order of best match
            if (search_results.length > 0) {
                var [bestMatch] = search_results;
                var index = search_results.indexOf(bestMatch);
                var id = bestMatch.item.title;

                search_curr_index = index;

                window.location.hash = id;
                search_num.innerText = String(search_curr_index + 1) + "/" + String(search_results.length);
                // Slide the browser to the best match id

                search_ind.classList.remove("hidden");
            }
        }
    });

    search_num.addEventListener("click", function(event) {
        if (search_results != undefined) {
            id = search_results[search_curr_index].item.title;
            window.location.hash = id;
        }
    });

    search_close.addEventListener("click", function(event) {
        search_results = undefined;
        search_curr_index = 0;
        search_ind.classList.add("hidden");
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

    document.getElementById('current-year').textContent = new Date().getFullYear();

    // ------------ FOOTER ------------

    var to_top = document.getElementsByClassName("to-top")[0];
    to_top.addEventListener("click", function() {
        window.scrollTo(0, 0);
    });

    window.addEventListener("scroll", function() {
        if (window.scrollY < 400) {
            // Top limit added based on layout
            to_top.classList.add("hidden");
        } else {
            to_top.classList.remove("hidden");
        }
    });

    // ------------ TO TOP ------------
});

function slideDown(section) {
    let content = section.querySelector(".content");
    if (section.classList.contains('hidden')) {
        section.classList.remove('hidden');
    }
}

function slideUp(section) {
    let content = section.querySelector(".content");
    if (content) {
        content.style.height = "0px";
    }
}

function slideSection(section) {
    // If a child section must be slided, all
    // parent sections must be slided too
    slideDown(section);
    parent_sections = getParentSectionsByClass(section);
    parent_sections.forEach(parent => {
        slideDown(parent);
    });
}

function collapseAllSections() {
    var sections = document.querySelectorAll(".section");
    sections.forEach(section => {
        slideUp(section);
    });
}

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

function getParentSectionsByClass(element) {
    const parentSections = [];
    let currentElement = element.parentElement;
  
    // Subir en la jerarquía mientras haya elementos padres
    while (currentElement) {
      if (currentElement.classList.contains('section')) {
        parentSections.push(currentElement);
      }
      currentElement = currentElement.parentElement; // Ir al siguiente padre
    }
  
    return parentSections;
}