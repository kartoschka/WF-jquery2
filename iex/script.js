const TEST_DATA = [
  {name: "dyson sphere galactic vacuum cleaner", price: 99999.95, imgurl: "img/test.gif"},
  {name: "housecat depilation cream 100ml", price: 4.35, imgurl: "img/test.gif"},
  {name: "actual plasma-based lightsaber", price: 5034.90, imgurl: "img/test.gif"},
  {name: "das kapital by karl marx", price: 1.95, imgurl: "img/test.gif"},
  {name: "ur mom", price: 0.50, imgurl: "img/test.gif"},
  {name: "duck", price: 0.55, imgurl: "img/test.gif"},
  {name: "big duck", price: 19.50, imgurl: "img/test.gif"},
  {name: "mega duck", price: 29.99, imgurl: "img/test.gif"},
  {name: "assorted duck collection in various colors", price: 399.75, imgurl: "img/test.gif"},
]

// id, name, price, imgurl, nselected
class Item {
  constructor(data, count_observers = []) {
    this.data = data
    this.count_observers = count_observers
    this.addToCartButton = this.makeAddToCartButton()
  }

  get id() { return this.data.id }
  get name() { return this.data.name }
  get price() { return Number(this.data.price) }
  get imgurl() { return this.data.imgurl }
  get nselected() { return Number(this.data.nselected) || 0}
  get incrButton() { return this.makeIncrButton() }
  get decrButton() { return this.makeDecrButton() }

  addCountObserver(o) {
    this.count_observers.push(o)
  }

  totaling() {
    return Math.floor(this.price * this.nselected)
  }

  increaseCount() {
    this.data.nselected = this.nselected + 1
    this.count_observers.forEach(o => o.notice(this))
  }

  decreaseCount() {
    if(this.nselected > 0) this.data.nselected = this.nselected - 1
    this.count_observers.forEach(o => o.notice(this))
  }

  makeIncrButton() {
    return $("<button>").text("+").click(
      e => { this.increaseCount() }
    )
  }
  
  makeDecrButton() {
    return $("<button>").text("-").click(
      e => { this.decreaseCount() }
    )
  }

  makeAddToCartButton() {
    return $("<button>").text("🛒").click(
      e => { this.increaseCount() }
    )
  }
}

class Cart {
  constructor(items=[]) {
    this.jqobj = $()
    this.view = {}
    this.content = {}
    items.forEach(i => { i.addCountObserver(this); this.addItem(i) })
  }

  addItem(item) {
    let new_jqobj = this.make_item_jqobj(item)
    this.content[item.id] = item
    this.view[item.id] = new_jqobj
    this.jqobj.append(new_jqobj)
  }

  rmItem(item) {
    this.view[item.id].remove() // jquery remove()
    delete this.content[item.id]
    delete this.view[item.id]
  }

  notice(changed_item) {
    console.log(changed_item)
    let count = changed_item.nselected
    if(count < 1) {
      this.rmItem(changed_item)
    } else {
      let old_view = this.view[changed_item.id]
      if(old_view) {
        let new_jqobj = this.make_item_jqobj(changed_item)
        old_view.replaceWith(new_jqobj)
        this.view[changed_item.id] = new_jqobj
      } else {
        this.addItem(changed_item)
      }
    }
  }

  init_jqobj() {
    let jq_objects = Object.entries(this.content).map(([k,i]) => {
      let item_jqobj = this.make_item_jqobj(i)
      this.view[i.id] = item_jqobj
      return item_jqobj
    })
    let jqlist = jq_objects.reduce((acc,o) => acc.add(o), $())
    let result =  $("<div id=cart-panel>").append(jqlist)
    this.jqobj = result
    return result
  }

  make_item_jqobj(i) {
    let topel  = $("<div class='item cart-item'>")
    let imgel  = $("<div class=imgbox>").append(`<img src=${i.imgurl}>`)
    let infoel = [["<h4 class=item-name>"  , i.name],
                  ["<div class=item-price>", i.price],
                  ["<div class=item-count>", i.nselected],
                  ["<div class=item-total>", i.totaling()]]
      .reduce((a,[e,txt]) => a.append($(e).text(txt)), $("<div class=cart-infobox>"))

    infoel.append(i.decrButton)
    infoel.append(i.incrButton)

    return topel.append(imgel).append(infoel)
  }
}

class Shop {
  constructor(items) {
    this.content = items
  }

  init_jqobj() {
    let itemlist = this.content.map(this.make_item_jqobj).reduce((acc,o) => acc.add(o), $())
    return $("<div id=shop-panel>").append(itemlist)
  }

  make_item_jqobj(i) {
    let topel  = $("<div class='item shop-item'>")
    let imgel  = $("<div class=imgbox>").append(`<img src=${i.imgurl}>`)
    let infoel = [["<h4 class=item-name>"  , i.name],
                  ["<div class=item-price>", i.price]]
      .reduce((a,[e,txt]) => a.append($(e).text(txt)), $("<div class=shop-infobox>"))

    infoel.append(i.addToCartButton)

    return topel.append(imgel).append(infoel)
  }
}

