<template class="main">
  <div class="mainContainer">
    <h1>Películas</h1>

    <div class="buttonContainer">
      <div class="searchBarContainer">
        <SearchBar @search="handleSearch" />
      </div>
      <div class="searchBarContainer">
        <AddMovie @loading-changed="updateLoading" @movie-added="fetchMovies" />
      </div>
    </div>
    <loading-overlay
      :active="loading"
      :color="'#000'"
      :opacity="0.5"
    ></loading-overlay>
    <div class="moviesContainer">
      <div class="cardContainer" v-for="(movie, index) in movies" :key="index">
        <b-card
          :title="movie.name"
          tag="article"
          style="max-width: 20rem"
          class="mb-2"
        >
          <img :src="movie.urlImage" class="card-img-top" alt="..." />
          <b-card-text> {{ movie.duration }} minutos </b-card-text>
          <b-card-text>Director: {{ movie.director }} </b-card-text>
          <b-card-text>Género: {{ movie.gender }} </b-card-text>
          <b-card-text>Categoría: {{ movie.category }} </b-card-text>
          <b-card-text
            >Fecha de publicación: {{ movie.publishDate }}
          </b-card-text>
          <b-button variant="danger" @click="deleteMovieById(movie.id)"
            >Eliminar</b-button
          >
          <b-button variant="primary" @click="openUpdateModal(movie.id)"
            >Actualizar</b-button
          >
        </b-card>
      </div>
    </div>
    <div>
      <!-- Modal de actualización -->
      <b-modal
        v-model="showUpdateModal"
        title="Actualizar película"
        hide-footer
      >
        <b-form @submit.prevent="sendUpdate">
          <b-form-group label="Nombre">
            <b-form-input v-model="updatedMovie.name" required></b-form-input>
          </b-form-group>
          <b-form-group label="Director">
            <b-form-input
              v-model="updatedMovie.director"
              required
            ></b-form-input>
          </b-form-group>
          <b-form-group label="Duración en minutos">
            <b-form-input
              v-model="updatedMovie.duration"
              required
            ></b-form-input>
          </b-form-group>
          <b-form-group label="Género">
            <b-form-select
              v-model="updatedMovie.gender"
              :options="genderOptions"
              required
            ></b-form-select>
          </b-form-group>
          <b-form-group label="Categoría">
            <b-form-select
              v-model="updatedMovie.category"
              :options="categoryOptions"
              required
            ></b-form-select>
          </b-form-group>
          <b-form-group label="Fecha de publicación">
            <b-form-input
              v-model="updatedMovie.publishDate"
              required
            ></b-form-input>
          </b-form-group>

          <b-button type="submit" variant="primary">Actualizar</b-button>
        </b-form>
      </b-modal>
    </div>
  </div>
</template>
<script>
import {
  getMovies,
  deleteMovie,
  updateMovie,
  getMovieById,
} from "../src/network/index";
import Vue from "vue";
import LoadingOverlay from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import SearchBar from "./components/SearchBar.vue";
import AddMovie from "@/components/AddMovie.vue";

export default Vue.extend({
  components: {
    LoadingOverlay,
    SearchBar,
    AddMovie,
  },
  data() {
    return {
      loading: false,
      lastSearch: "",
      categoryOptions: ["Infantil", "Adolescente", "Adulto"],
      genderOptions: [
        "Drama",
        "Comedia",
        "Acción",
        "Ciencia ficción",
        "Romance",
        "Documental",
      ],
      movies: [],
      errors: {},
      showUpdateModal: false,
      updatedMovie: {
        id: null,
        name: "",
        duration: null,
        gender: "",
        director: "",
        category: "",
        publishDate: "",
      },
    };
  },
  async created() {
    await this.fetchMovies();
  },
  methods: {
    async fetchMovies() {
      try {
        this.loading = true;
        this.movies = await getMovies();
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    updateLoading(newValue) {
      this.loading = newValue;
    },
    handleSearch(searchQuery) {
      if (searchQuery.length === 0) {
        this.fetchMovies();
      } else {
        this.movies = searchQuery;
      }
    },
    async deleteMovieById(id) {
      try {
        this.loading = true;
        await deleteMovie(id);
        await this.fetchMovies();
      } finally {
        this.loading = false;
      }
    },
    async openUpdateModal(id) {
      this.showUpdateModal = true;
      try {
        this.updatedMovie = await getMovieById(id);
      } catch (error) {
        console.error(error);
      }
    },
    async sendUpdate() {
      this.showUpdateModal = false;
      this.loading = true;
      try {
        const dataUpdated = {
          name: this.updatedMovie.name,
          duration: this.updatedMovie.duration,
          gender: this.updatedMovie.gender,
          director: this.updatedMovie.director,
          category: this.updatedMovie.category,
          publishDate: this.updatedMovie.publishDate,
        };
        updateMovie(this.updatedMovie.id, dataUpdated);
        await this.fetchMovies();
      } finally {
        await this.fetchMovies();
        this.loading = false;
      }
    },
  },
});
</script>

<style>
.main {
  display: flex;
}
.mainContainer {
  flex: 1;
}
.moviesContainer {
  display: flex;
  flex-wrap: wrap;
  padding: 0% 1% 1% 1%;
  justify-content: space-between;
}
.cardContainer {
  padding: 1%;
}
.buttonContainer {
  display: flex;
  justify-content: end;
  padding: 1%;
}
.searchBarContainer {
  padding-right: 0.2%;
}
</style>
