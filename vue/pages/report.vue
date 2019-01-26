<template>
  <section class="header">
    <section class="container-fluid bg-blue">
      <nav class="navbar navbar-expand-lg navbar-light bg-blue">
        <img class="navbar-brand with-logo"
             src="../img/police_boston_logo.png"
             alt="logo_police_boston">
        <button class="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation">
          <span class="navbar-toggler-icon">Toto</span>
        </button>
        <div id="navbarSupportedContent"
             class="collapse navbar-collapse">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item active">
              <a class="nav-link white-color"
                 href="/">Home <span class="sr-only">(current)</span></a>
            </li>
            <li class="nav-item dropdown">
              <a id="navbarDropdown"
                 class="nav-link white-color"
                 href="report"
                 role="button"
                 data-toggle="dropdown"
                 aria-haspopup="true"
                 aria-expanded="false">Report crime</a>
            </li>
            <li class="nav-item">
              <a class="nav-link disabled white-color"
                 href="/sign-out">Sign out</a>
            </li>
          </ul>
          <form class="form-inline my-2 my-lg-0">
            <input class="form-control mr-sm-2"
                   type="search"
                   placeholder="Search"
                   aria-label="Search">
            <button class="btn btn-outline-success my-2 my-sm-0"
                    type="submit">Search</button>
          </form>
        </div>
      </nav>
    </section>
    <section class="container">
      <h1 class="text-center padding_10">Report Crimes</h1>
      <form>
        <div class="form-group">
          <label for="exampleFormControlInput1">First Name</label>
          <input id="exampleFormControlInput1"
                 type="email"
                 class="form-control"
                 placeholder="First Name">
          <label for="exampleFormControlInput1">Last Name</label>
          <input id="exampleFormControlInput1"
                 type="email"
                 class="form-control"
                 placeholder="Last Name">
          <label for="exampleFormControlInput1">Email address</label>
          <input id="exampleFormControlInput1"
                 type="email"
                 class="form-control"
                 placeholder="name@example.com">
        </div>
        <div class="form-group">
          <label for="exampleFormControlSelect2">Deli</label>
          <select id="exampleFormControlSelect2"
                  class="form-control"
                  multiple>
            <option>Delit 1</option>
            <option>Delit 2</option>
            <option>Delit 3</option>
            <option>Delit 4</option>
            <option>Delit 5</option>
          </select>
        </div>
        <div class="form-group">
          <label for="exampleFormControlTextarea1">Example textarea</label>
          <textarea id="exampleFormControlTextarea1"
                    class="form-control"
                    rows="3">Deposition</textarea>
        </div>
      </form>
    </section>
  </section>
</template>

<script>

</script>

<style>
.title {
  font-family: 'Quicksand', 'Source Sans Pro', sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

body {
    margin: 0;
}

.white-color {
    color: #FFF!important;
}

.with-logo {
    width: 50px;
}
.bg-blue {
    background-color: #000f47!important;
}

.btn-outline-success {
    color: #5493C7;
    border-color: #5493C7;
}

.btn-outline-success:hover,
.btn-outline-success:focus {
    border-color: transparent;
    background-color: #5493C7;
}

.margin_auto {
  margin: 0 auto;
}

.img_wight {
  width: 281px;
}

.padding_10 {
  padding: 10px;
}

.padding_top_bot_20 {
  padding: 20px 0;
}

</style>
