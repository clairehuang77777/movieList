const Base_URL = 'https://webdev.alphacamp.io'
const Index_URL = Base_URL + '/api/movies/'
const Poster_URL = Base_URL + '/posters/'

//用const 去命名movie, 因為想強調movie不能被重複賦值
const movies = []
const dataPanel = document.querySelector('#data-panel')
const SearchForm = document.querySelector('#search-form')
const SearchInput = document.querySelector("#search-input")
const pagination = document.querySelector("#pagination")
const Movies_per_page = 12 //每頁要顯示12個電影卡片
let filterMovie = [] //變成全域變數，為了要讓大家都可以改動

const movieGirdView = document.querySelector("#movieGirdView")
const movieListView = document.querySelector("#movieListView")
const viewSelection = document.querySelector(".viewSelection")
let page =[] //將page改成global參數

//true的話代表現在顯示list view
if (document.querySelector("#currentListView")){
  console.log("it's List View now!")
} else {
  console.log("it's grid View now!")
}


// dataPanel.classList.add("GridView")

function renderMovieListView(data) {
  let htmlContent = '<div id="currentListView" class="row">'
  data.forEach((item) => {
    htmlContent += `<ul class="list-group">
  <li class="list-group-item"> ${item.title} 
  <div id="insideListBtn">
  <button type="button" class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id=${item.id}>More</button>
  <button type="button" class="btn btn-info btn-add-to-favorite" data-id=${item.id}>+</button>
  </div>
  </li>
  `
  })
  dataPanel.innerHTML = htmlContent + '</div>'
}

//這邊用data而不直接使用movie是為了降低程式的耦合性
function renderMovieGridView(data){
  let htmlContent = '<div id="currentGridView" class="row">'
    data.forEach((item) => {
    htmlContent += `
      <div class="col-sm-3">
          <div class="mb-2">
            <div class="card">
              <img
                src= "${Poster_URL + item.image}"
                class="card-img-top" alt="Movie Poster">
              <div class="card-body p-1 ">
                <h5 class="card-title ">${item.title}</h5>
                <div class="card-footer">
                  <button type="button" class="btn btn-primary btn-show-movie" data-bs-toggle="modal"
                    data-bs-target="#movie-modal" data-id=${item.id}>More</button>
                  <button type="button" class="btn btn-info btn-add-to-favorite" data-id=${item.id}>+</button>
                </div>
              </div>
            </div>
           </div>
          </div>` 
            })
    dataPanel.innerHTML = htmlContent + '</div>'
}
//邏輯一：當我一點擊More btn, 幫我傳送id值，並傳到另一個function中
//邏輯二：當我一點擊add btn, 幫我傳送id值，並
dataPanel.addEventListener("click",function(event){
  if (event.target.matches(".btn-show-movie")){
    let id = (Number(event.target.dataset.id))
    showMovieModal(id)
  } else if (event.target.matches(".btn-add-to-favorite")){
    addtoFavorites(Number(event.target.dataset.id))
  }
})



function addtoFavorites(id){
  //在本地local端讀取一個名為favorite的電影列表，沒有的話返回空陣列
  //不能直接用list=[]的方式，因為這樣每次讀取函數都會再次把list變為空陣列
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  
  //篩選出符合id的movie object, 並return出來為movie

  const movie = movies.find((movie) => movie.id === id)
  
  // 在list內回圈，只要有部分符合條件，就回傳true
  if (list.some((movie) => movie.id === id)){
    alert('此電影已經在搜尋清單中')
  }

  //把movie加入list陣列中
  list.push(movie)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
 }

 

//拿到id值，並發送api,並把畫面render出來
function showMovieModal(id){
  const movieModalTitle = document.querySelector('#movie-modal-title')
  const MovieModalImage = document.querySelector('#movie-modal-image img')
  const MovieModalDate  = document.querySelector('#movie-modal-date')
  const MovieModalDescription = document.querySelector('#movie-modal-description')

  //用axios取得res
  axios
    .get(Index_URL+id)
    .then(function (response){
      const data = response.data.results
      movieModalTitle.innerHTML = data.title
      MovieModalImage.src = Poster_URL + data.image
      MovieModalDate.innerText = data.release_date
      MovieModalDescription.innerText = data.description
    })
    .catch(function(error){
      console.log(error)
    })
  }


axios
  .get(Index_URL)
  .then(function (response) {
    movies.push(...response.data.results)
    renderPaginator(movies.length)
    renderMovieGridView(getMovieByPage(1)) //********此處去叫程式render出電影畫面!!!! */
  })
  .catch(function (error) {
    console.log(error)
  })

  console.log(movies)

  //監聽表單提交事件
  SearchForm.addEventListener("submit",function onsearchFormSubmitted(event){
    event.preventDefault()
    const keyword = SearchInput.value.toLowerCase()

    if (keyword.length == 0){
      return alert(`請輸入有效字串`)
    }

    //用filter寫法
    function Moviefitkeyword(movie){
      return movie.title.toLowerCase().includes(keyword)
    }

    filterMovie = movies.filter(Moviefitkeyword)
    console.log(filterMovie)

    if (filterMovie.length === 0) {
      return alert(`您輸入的關鍵字${keyword}沒有符合條件的電影` )
    }
    renderPaginator(filterMovie.length)
    renderMovieGridView(getMovieByPage(1))

  })


// 從總清單裡切割資料 
function getMovieByPage(page) {
  //movies改為用data判斷，data傳進的值會變化，如果filterdata有值，放filterdata; 沒值就放Movie
  const data = filterMovie.length ? filterMovie : movies
  //計算index
  const startIndex = (page - 1) * Movies_per_page
  //回傳切割後的新陣列
  return data.slice(startIndex, startIndex + Movies_per_page)
}

//狀態, 是在grid view時，

//把Paginator正確的顯示出來

function renderPaginator(amount) {
  let htmltext = ''
  let pagecount = Math.ceil(amount / Movies_per_page)
  for ( i = 1 ; i <= pagecount; i++){
    htmltext += `
       <a class="page-link" href="#" data-page="${i}">${i}</a></li >`
  }
  pagination.innerHTML = htmltext
}
//讓paginator第二頁在grid情境下顯示gridView, 在list情境下顯示listview
//點擊切換器，觸發RenderMovie
pagination.addEventListener("click",function onPaginatorClicked(event){
  console.log(event.target)
  page = (Number(event.target.dataset.page))
  if (event.target.matches(".page-link")){ 
    //true代表現在顯示list,顯示List view,false代表現在顯示Grid,顯示Grid view
    if (document.querySelector("#currentListView")) { 
      console.log("it's List View now!") 
      renderMovieListView(getMovieByPage(page))
    } else { 
      console.log("it's Grid View now!")
      renderMovieGridView(getMovieByPage(page)) 
    }
  }
})


//在list內對paginator點擊 應該是要出現list
viewSelection.addEventListener("click", function (event) {
  if (event.target.id === "movieListView"){
    //renderPaginator(movies.length)
    renderMovieListView(getMovieByPage(page)) /*這裡的1應該改成當前在render的頁面 */
  }
  else {
    //if (event.target.id === "movieGridView") {
    //renderPaginator(movies.length)
    renderMovieGridView(getMovieByPage(page))
    }
  })



  //在第二頁去點擊List icon切換成列表模式時，要維持List icon.





//先寫邏輯馬
/* 上課內容
V view顯示相關
M model 資料相關
c controller

/* 外部定義狀態
display_state 
{ defaultDisplay : defaultDisplay,
  Listdisplay: list display


/*
/外部儲存 data (M) ****global scope定義movies, 因為要讓movies可以被使用到
const movies 

/中樞系統
原始
default 畫面 gird view,
當點擊list view時，顯示list view

在list view點擊grid時, 顯示grid view


/* 透過“點擊” 去觸發不同頁面的轉換 (點擊發生地: .viewSelection)
document.querySelector(".viewSelection").addEventListener("Click", (event) =>
  if (event.id.matches(".movieListView")){
    renderMovieListView(data)}
  else if (event.id.matches(".movieGirdView")){
  renderMovieGridView}

*/