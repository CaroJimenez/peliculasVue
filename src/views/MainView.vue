<template class="main">
  <div>
    <div class="moviesMainContainer" v-show="showElement">
      <h1>Películas</h1>

      <div class="buttonContainer">
        <div class="searchBarContainer">
          <SearchBar @search="handleSearch" />
        </div>
        <div class="searchBarContainer">
          <AddMovie
            @loading-changed="updateLoading"
            @movie-added="fetchMovies"
          />
        </div>
      </div>
      <loading-overlay
        :active="loading"
        :color="'#000'"
        :opacity="0.5"
      ></loading-overlay>
      <div class="moviesContainer">
        <div
          class="cardContainer"
          v-for="(movie, index) in movies"
          :key="index"
        >
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

    <div class="bannerContainer">
      <b-carousel
        id="carousel-fade"
        style="text-shadow: 0px 0px 2px #000"
        no-animation
        indicators
        img-width="1024"
        img-height="480"
      >
        <b-carousel-slide
          img-src="https://i0.wp.com/thegameofnerds.com/wp-content/uploads/2023/09/HOTTEST-MOVIES-OF-SUMMER-2023-scaled.jpg?resize=1280%2C640&ssl=1"
        ></b-carousel-slide>
        <b-carousel-slide
          img-src="https://res.klook.com/image/upload/q_85/c_fill,w_750/v1686680641/rl0gqzptxa6v1lwkfcpc.jpg"
        ></b-carousel-slide>
      </b-carousel>
      <div class="bannerTitleContainer">
        <h1 class="bannerTitle">Muy pronto...</h1>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getMovies,
  deleteMovie,
  updateMovie,
  getMovieById,
} from "../network/index";
import Vue from "vue";
import LoadingOverlay from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import SearchBar from "../components/SearchBar.vue";
import AddMovie from "@/components/AddMovie.vue";

export default Vue.extend({
  components: {
    LoadingOverlay,
    SearchBar,
    AddMovie,
  },
  data() {
    return {
      showElement: true,
      lastScrollPosition: 0,
      loading: false,
      lastSearch: "",
      slide: 0,
      sliding: null,
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
  mounted() {
    window.addEventListener("scroll", this.onScroll);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.onScroll);
  },
  async created() {
    await this.fetchMovies();
  },
  methods: {
    onScroll() {
      const currentScrollPosition =
        window.pageYOffset || document.documentElement.scrollTop;
      console.log(currentScrollPosition);
      if (Math.abs(currentScrollPosition - this.lastScrollPosition) < 60) {
        return;
      }
      this.showElement = currentScrollPosition < this.lastScrollPosition;
      this.lastScrollPosition = currentScrollPosition;
    },
    onSlideStart(slide) {
      this.sliding = true;
    },
    onSlideEnd(slide) {
      this.sliding = false;
    },
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
      this.movies = searchQuery;
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
.moviesMainContainer {
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
.bannerContainer {
  background-color: #0f71f2;
  height: 1000px;
}
.bannerTitle {
  color: white;
}
.bannerTitleContainer {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
