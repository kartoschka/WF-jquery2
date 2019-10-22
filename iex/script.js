const TEST_DATA = [
  {name: "dyson sphere galactic vacuum cleaner", price: 99999.95, imgurl: ""},
  {name: "housecat depilation cream 100ml", price: 4.35, imgurl: ""},
  {name: "actual plasma-based lightsaber", price: 5034.90, imgurl: ""},
  {name: "das kapital by karl marx", price: 1.95, imgurl: ""},
  {name: "ur mom", price: 0.50, imgurl: ""},
  {name: "duck", price: 0.55, imgurl: ""},
  {name: "big duck", price: 19.50, imgurl: ""},
  {name: "mega duck", price: 29.99, imgurl: ""},
  {name: "assorted duck collection in various colors", price: 399.75, imgurl: ""},
]

// id, name, price, imgurl, nselected
class Item {
  constructor(data, count_observers = []) {
    this.data = data
    this.count_observers = count_observers
  }

  get id() { return this.data.id }
  get name() { return this.data.name }
  get price() { return Number(this.data.price) }
  get nselected() { return Number(this.data.nselected) || 0}

  addCountObserver(o) {
    this.count_observers.push(o)
  }

  totaling() {
    return this.price * this.nselected
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
  }

  make_nselected_jqobj
}

class Cart {
  constructor(items=[]) {
    this.content = {}
    items.forEach(i => { i.addCountObserver(this); addItem(i) })

    this.view = {}
  }

  addItem(item) {
    this.content[item.id] = item
    update_view()
  }

  rmItem(item) {
    delete this.content[item.id]
    update_view(item)
  }

  notice(changed_item) {
    let count = changed_item.nselected
    if(count < 1) {
      rmItem(item)
    } else {

    }
  }

  init_jqobj() {
    let jq_objects = this.content.map(i => {
      let item_jqobj = make_item_jqobj(i)
      this.view[i.id] = item_jqobj
      return item_jqobj
    })
    let jqlist = jq_objects.reduce((acc,o) => acc.add(o), $())
    return $("<div id=item-panel>").append(jqlist)
  }

  make_item_jqobj(i) {
    let topel  = $("<div class='item cart-item'>")
    let imgel  = $("<div class=imgbox>").append(`<img src=${i.imgurl}>`)
    let infoel = [["<h4 class=item-name>"  , i.name],
                  ["<div class=item-price>", i.price],
                  ["<div class=item-count>", i.nselected],
                  ["<div class=item-total>", i.totaling()]]
      .reduce((a,[e,txt]) => a.append($(e).text(txt)), $("<div class=cart-infobox>"))

    return topel.append(imgel).append(infoel)
  }
}

class Shop {
  constructor(items) {
    this.content = items
  }

  make_jqobj() {
    let itemlist = this.content.map(this.make_item_jqobj).reduce((acc,o) => acc.add(o), $())
    return $("<div id=shop-panel>").append(itemlist)
  }

  make_item_jqobj(i) {
    let topel  = $("<div class='item shop-item'>")
    let imgel  = $("<div class=imgbox>").append(`<img src=${i.imgurl}>`)
    let infoel = [["<h4 class=item-name>"  , i.name],
                  ["<div class=item-price>", i.price]]
      .reduce((a,[e,txt]) => a.append($(e).text(txt)), $("<div class=cart-infobox>"))

    return topel.append(imgel).append(infoel)
  }
}

const ItemList = []
for(let index in TEST_DATA) {
  let data = TEST_DATA[index]
  data.id = index
  ItemList.push(new Item(data))
}

