<template>
  <v-fragment>
    <div class="container-fluid bg-blue">
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
                 href="sign-out">Sign out</a>
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
    </div>
    <div class="container-fluid">
      <div class="row">
        <div>
          <div class="col-md-6">
            <h1 class="text-center">Crimes Listing</h1>
          </div>
          <div class="col-12">
            <div class="table-responsive">
              <table class="table table-hover">
                <tr scope="row">
                  <th>
                    <td scope="col">compnos</td>
                    <td scope="col">naturecode</td>
                    <td scope="col">incident_type_description</td>
                    <td scope="col">main_crimecode</td>
                    <td scope="col">reptdistrict</td>
                    <td scope="col">reportingarea</td>
                    <td scope="col">fromdate</td>
                    <td scope="col">weapontype</td>
                    <td scope="col">shooting</td>
                    <td scope="col">domestic</td>
                    <td scope="col">shift</td>
                    <td scope="col">year</td>
                    <td scope="col">month</td>
                    <td scope="col">day_week</td>
                    <td scope="col">ucrpart</td>
                    <td scope="col">x</td>
                    <td scope="col">y</td>
                    <td scope="col">streetname</td>
                    <td scope="col">xstreetname</td>
                    <td scope="col">location</td>
                  </th>
                </tr>
                <tr v-for="crime of crimes"
                    :key="crime.id"
                    scope="row">
                  <td scope="col">{{ crime.compnos }}</td>
                  <td>{{ crime.naturecode }}</td>
                  <td>{{ crime.incident_type_description }}</td>
                  <td>{{ crime.main_crimecode }}</td>
                  <td>{{ crime.reptdistrict }}</td>
                  <td>{{ crime.reportingarea }}</td>
                  <td>{{ crime.fromdate }}</td>
                  <td>{{ crime.weapontype }}</td>
                  <td>{{ crime.shooting }}</td>
                  <td>{{ crime.domestic }}</td>
                  <td>{{ crime.shift }}</td>
                  <td>{{ crime.year }}</td>
                  <td>{{ crime.month }}</td>
                  <td>{{ crime.day_week }}</td>
                  <td>{{ crime.ucrpart }}</td>
                  <td>{{ crime.x }}</td>
                  <td>{{ crime.y }}</td>
                  <td>{{ crime.streetname }}</td>
                  <td>{{ crime.xstreetname }}</td>
                  <td>{{ crime.location }}</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </v-fragment>
</template>
<script>
import { mapState } from 'vuex'
import axios from 'axios'

export default {
        async fetch({store}) {
            const res = await axios('http://127.0.0.1:3000/v1/crimes-listing')
            store.commit('initial', res.data)
        },
        computed: {
            ...mapState({
                crimes: state => state.crimes
            })
        }
}
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
