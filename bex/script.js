const DATA = {
  "Christmas bell": "img/1-2-christmas-bell-png-image.png",
  "Gift box": "img/White_Gift_Box_with_Red_Bow_PNG_Image_2048x.png",
  "Santa Claus": "img/santa-claus.png"
}

function hr() {
  $("body").append("<hr>")
}

function ex1() {
  Object.entries(DATA).reduce((acc, [title,url]) => acc.add(make_jqimg(url, title)), $())
    .click(popup_id)
    .appendTo("body")
}

function make_jqimg(url, id) {
  return $("<img>").attr("src", url).attr("id", id || null).css({"max-width": "200px", "max-height": "200px"})
}

function popup_id(e) {
  let jqel = $(e.target)
  let pos = jqel.position()
  let popup = $("<div>")
    .css({"position": "absolute", 
          "top": pos.top, "left": pos.left,
          "background": "yellow"})
    .text(jqel.attr("id"))

  $("body").append(popup)
  setTimeout(()=>popup.remove(), 3000)
}

function ex2() {
  $("<div>")
    .css({"display": "grid", "grid-template-columns": "repeat(3, 200px)", "grid-auto-rows": "200px"})
    .append(["Gift box", "Santa Claus", "Gift box",                
             "Gift box", "Santa Claus", "Gift box",                 
             "Santa Claus", "Gift box", "Santa Claus"]              
               .reduce((jq, el) => {let jqobj = make_jqimg(DATA[el])
                                    if(el == "Santa Claus") jqobj.click(e => $(e.target).remove())
                                    return jq.add(jqobj)}, $()))
    .appendTo("body")
  
  
}

