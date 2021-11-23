// Class that defines the elements of a carousel and his functions
class Carousel {
    constructor(element) {
        this.element = element
        this.nbItemsVisible = 4
        this.nbItemsScroll = 4
        this.currentItem = 0
        let children = [].slice.call(element.children)
        this.container = createDivWithClass('carousel')
        this.element.appendChild(this.container)
        this.items = children.map((child) => {
            let item = createDivWithClass("carousel_item")
            item.appendChild(child)
            this.container.appendChild(item)
            return item
        });
        let ratio = this.items.length / this.nbItemsVisible
        this.container.style.width = (ratio * 100) + "%"
        this.items.forEach(item => item.style.width = ((100 / this.nbItemsVisible) / ratio) + "%")
        this.createNavigationButton()
    }
    createNavigationButton() {
        let next = createDivWithClass("next")
        let prev = createDivWithClass("prev")
        this.element.appendChild(next)
        this.element.appendChild(prev)
        next.addEventListener('click', this.goNext.bind(this))
        prev.addEventListener('click', this.goPrev.bind(this))
    }
    goNext() {
        this.goToItem(this.currentItem + this.nbItemsScroll)
    }
    goPrev() {
        this.goToItem(this.currentItem - this.nbItemsScroll)
    }
    goToItem(numItem) {
        if (numItem < (1 - this.nbItemsVisible) || (numItem < this.items.length && numItem + this.nbItemsVisible > this.items.length)) {
            numItem = this.items.length - this.nbItemsVisible
        } else if (numItem < 0 || numItem >= this.items.length) {
            numItem = 0
        }
        let translateX = numItem * -100 / this.items.length
        this.container.style.transform = 'translate3d(' + translateX + '%, 0, 0)'
        this.currentItem = numItem
    }
}

// We create the 4 carousel
document.addEventListener("DOMContentLoaded", function() {
    new Carousel(document.querySelector("#best_movies"))
    new Carousel(document.querySelector("#cat1"))
    new Carousel(document.querySelector("#cat2"))
    new Carousel(document.querySelector("#cat3"))
})

// Get the url for the first carousel
url_best_movies = "http://localhost:8000/api/v1/titles/?year=&min_year=&max_year=&imdb_score=&imdb_score_min=&imdb_score_max=&title=&title_contains=&genre=&genre_contains=&sort_by=-imdb_score&director=&director_contains=&writer=&writer_contains=&actor=&actor_contains=&country=&country_contains=&lang=&lang_contains=&company=&company_contains=&rating=&rating_contains="
let categories = ["Romance", "Action", "Comedy"]
let urls = [url_best_movies]
for (cat of categories) {
    url = `http://localhost:8000/api/v1/titles/?year=&min_year=&max_year=&imdb_score=&imdb_score_min=&imdb_score_max=&title=&title_contains=&genre=${cat}&genre_contains=&sort_by=-imdb_score&director=&director_contains=&writer=&writer_contains=&actor=&actor_contains=&country=&country_contains=&lang=&lang_contains=&company=&company_contains=&rating=&rating_contains=`
    urls.push(url)
}
let nbMovie = 0
index = '0'
nbMovie = 0
test(urls[0], index)
for (i = 0; i < urls.length; i++) {
    nbMovie = 0
        //test(urls[i], String(i + 1))
}
// Function to get first 7 movies
async function getAllGenre(url_filter, index) {
    fetch(url_filter).then((response) => response.json().then((data) => {
        for (let movie of data.results) {
            if (nbMovie < 7) {
                nbMovie++
                display(index, nbMovie, movie)
            } else {
                break
            }
        }
        if (data.next != null && nbMovie < 7) {
            getAllGenre(data.next, index)
        }
    }))
}

// Other method
async function getMovies(url_filter) {
    const rep = await fetch(url_filter, { method: 'GET' });
    const response = await rep.json();
    return response;
}
// Other method
async function test(url_filter, index) {
    getMovies(url_filter, index).then(data => {
        for (let movie of data.results) {
            if (nbMovie < 7) {
                nbMovie++
                display(index, nbMovie, movie)
            } else {
                break
            }
        }
        if (data.next != null && nbMovie < 7) {
            test(data.next, index)
        }

    });
}
// Function to add the movie info on the page html
function display(index, nbMovie, movie) {
    id_element = `#item${index + String(nbMovie)}`
    element = document.querySelector(id_element)
    div_title = createDivWithClass("movie_title")
    div_title.innerHTML = movie.title
    var img = document.createElement('img')
    img.src = movie.image_url;
    element.appendChild(img)
    element.appendChild(div_title)
}

// Create a new div
function createDivWithClass(className) {
    let div = document.createElement('div')
    div.setAttribute('class', className)
    return div
}