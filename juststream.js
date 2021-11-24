// Class for the first movie found
class FirstMovie {
    constructor(element, url) {
        this.element = element
        this.url = url
        this.movie = null
        this.getInfoMovie(this.url)
    }
    async getInfoMovie(url) {
        fetch(url).then((response) => response.json().then((data) => {
            for (let result of data.results) {
                var first_result = result
                break
            }
            fetch(first_result.url).then((response) => response.json().then((data) => {
                this.movie = data
                var img = document.createElement('img')
                img.src = this.movie.image_url;
                this.element.appendChild(img)
                var info_div = document.createElement("div")
                info_div.setAttribute('id', 'first_info')
                this.element.appendChild(info_div)
                var title_item = document.createElement("h2")
                title_item.innerHTML = this.movie.title
                info_div.appendChild(title_item)
                var btn = document.createElement('button')
                btn.setAttribute('class', 'btn_play')
                btn.innerHTML = 'Play'
                info_div.appendChild(btn)
                var description = document.createElement('p')
                description.innerHTML = '<span><b>Description :</b></span> ' + this.movie.description
                info_div.appendChild(description)

            }))
        }))
    }
}

// Class that defines the elements of a carousel and his functions
class Carousel {
    constructor(element, url_carousel, id) {
        this.element = element
        this.url = url_carousel
        this.index = id
        this.nbItemsVisible = 4
        this.nbItemsScroll = 4
        this.currentItem = 0
        this.nbMovies = 7
        this.numMovie = 0
        if (id == '0') {
            this.notFirstItem = true
        } else {
            this.notFirstItem = false
        }

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
                if (this.notFirstItem && this.numMovie == 0) {
                    this.notFirstItem = false
                } else {
                    if (this.numMovie < this.nbMovies) {
                        this.numMovie = this.numMovie + 1
                        display(this.index, this.numMovie, movie)
                    } else {
                        break
                    }
                }
            }
            if (data.next != null && this.numMovie < this.nbMovies) {
                this.getAllGenre(data.next)
            }
        }))
    }

}
document.addEventListener("DOMContentLoaded", function() {
    // Get the url for the first carousel
    url_best_movies = "http://localhost:8000/api/v1/titles/?year=&min_year=&max_year=&imdb_score=&imdb_score_min=&imdb_score_max=&title=&title_contains=&genre=&genre_contains=&sort_by=-imdb_score&director=&director_contains=&writer=&writer_contains=&actor=&actor_contains=&country=&country_contains=&lang=&lang_contains=&company=&company_contains=&rating=&rating_contains="
    new FirstMovie(document.querySelector("#best_one"), url_best_movies)
    let categories = ["Romance", "Action", "Comedy"]
    let urls = [url_best_movies]
    for (cat of categories) {
        document.querySelector(`#cat${urls.length}_title`).innerHTML = cat
        url = `http://localhost:8000/api/v1/titles/?year=&min_year=&max_year=&imdb_score=&imdb_score_min=&imdb_score_max=&title=&title_contains=&genre=${cat}&genre_contains=&sort_by=-imdb_score&director=&director_contains=&writer=&writer_contains=&actor=&actor_contains=&country=&country_contains=&lang=&lang_contains=&company=&company_contains=&rating=&rating_contains=`
        urls.push(url)
    }

    // We create the 4 carousel
    new Carousel(document.querySelector("#best_movies"), urls[0], '0')
    new Carousel(document.querySelector("#cat1"), urls[1], '1')
    new Carousel(document.querySelector("#cat2"), urls[2], '2')
    new Carousel(document.querySelector("#cat3"), urls[3], '3')
})


// Function to add the movie info on the page html
function display(index, nbMovie, movie) {
    id_element = `#item${index + String(nbMovie)}`
    element = document.querySelector(id_element)
        // div_title = createDivWithClass("movie_title")
        // div_title.innerHTML = movie.title
    var img = document.createElement('img')
    img.src = movie.image_url;
    element.appendChild(img)
        // element.appendChild(div_title)
}

// Create a new div
function createDivWithClass(className) {
    let div = document.createElement('div')
    div.setAttribute('class', className)
    return div
}