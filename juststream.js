// Class that defines the elements of a carousel and his functions
class Carousel {
    constructor(element, url_carousel, id) {
        this.element = element
        this.url = url_carousel
        console.log(element)
        console.log(id)
        console.log(url_carousel)
        this.index = id
        this.nbItemsVisible = 4
        this.nbItemsScroll = 4
        this.currentItem = 0
        this.nbMovies = 7
        this.numMovie = 0
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
        this.getAllGenre(this.url)
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
    async getAllGenre(url) {
        fetch(url).then((response) => response.json().then((data) => {
            for (let movie of data.results) {
                if (this.numMovie < this.nbMovies) {
                    this.numMovie = this.numMovie + 1
                    display(this.index, this.numMovie, movie)
                } else {
                    break
                }
            }
            if (data.next != null && this.numMovie < this.nbMovies) {
                this.getAllGenre(data.next)
            }
        }))
    }

}

// Get the url for the first carousel
url_best_movies = "http://localhost:8000/api/v1/titles/?year=&min_year=&max_year=&imdb_score=&imdb_score_min=&imdb_score_max=&title=&title_contains=&genre=&genre_contains=&sort_by=-imdb_score&director=&director_contains=&writer=&writer_contains=&actor=&actor_contains=&country=&country_contains=&lang=&lang_contains=&company=&company_contains=&rating=&rating_contains="
let categories = ["Romance", "Action", "Comedy"]
let urls = [url_best_movies]
for (cat of categories) {
    url = `http://localhost:8000/api/v1/titles/?year=&min_year=&max_year=&imdb_score=&imdb_score_min=&imdb_score_max=&title=&title_contains=&genre=${cat}&genre_contains=&sort_by=-imdb_score&director=&director_contains=&writer=&writer_contains=&actor=&actor_contains=&country=&country_contains=&lang=&lang_contains=&company=&company_contains=&rating=&rating_contains=`
    urls.push(url)
}

// We create the 4 carousel
document.addEventListener("DOMContentLoaded", function() {
    console.log(urls[0])
    new Carousel(document.querySelector("#best_movies"), urls[0], '0')
    console.log(urls[1])
    new Carousel(document.querySelector("#cat1"), urls[1], '1')
    console.log(urls[2])
    new Carousel(document.querySelector("#cat2"), urls[2], '2')
    console.log(urls[3])
    new Carousel(document.querySelector("#cat3"), urls[3], '3')
})


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