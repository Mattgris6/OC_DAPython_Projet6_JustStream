class Carousel{
    constructor (element){
        this.element = element
        this.nbItemsVisible = 4
        this.nbItemsScroll = 4
        this.currentItem = 0
        let children = [].slice.call(element.children)
        this.container = this.createDivWithClass('carousel')
        this.element.appendChild(this.container)
        this.items = children.map((child) => {
            let item = this.createDivWithClass("carousel_item")
            item.appendChild(child)
            this.container.appendChild(item)
            return item
        });
        let ratio = this.items.length / this.nbItemsVisible
        this.container.style.width = (ratio * 100) + "%"
        this.items.forEach(item => item.style.width = ((100 / this.nbItemsVisible) / ratio) + "%")
        this.createNavigationButton()
    }
    createDivWithClass(className){
        let div = document.createElement('div')
        div.setAttribute('class', className)
        return div
    }
    createNavigationButton(){
        let next = this.createDivWithClass("next")
        let prev = this.createDivWithClass("prev")
        this.element.appendChild(next)
        this.element.appendChild(prev)
        next.addEventListener('click', this.goNext.bind(this))
        prev.addEventListener('click', this.goPrev.bind(this))
    }
    goNext(){
        this.goToItem(this.currentItem + this.nbItemsScroll)
    }
    goPrev(){
        this.goToItem(this.currentItem - this.nbItemsScroll)
    }
    goToItem(numItem){
        if (numItem<(1-this.nbItemsVisible) || (numItem < this.items.length && numItem+this.nbItemsVisible > this.items.length)){
            numItem = this.items.length - this.nbItemsVisible  
        } else if (numItem<0 || numItem >= this.items.length){
            numItem = 0
        }
        let translateX = numItem * -100 / this.items.length
        this.container.style.transform = 'translate3d(' + translateX + '%, 0, 0)'
        this.currentItem = numItem
    }
}

document.addEventListener("DOMContentLoaded", function() {
    new Carousel(document.querySelector("#best_movies"))
    new Carousel(document.querySelector("#cat1"))
    new Carousel(document.querySelector("#cat2"))
    new Carousel(document.querySelector("#cat3"))
})
