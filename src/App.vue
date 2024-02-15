<template class="main">
  <div class="mainContainer">
    <h1>Películas</h1>
    <div class="buttonContainer">
      <b-button variant="primary" v-b-modal.modal-1>Add movie here</b-button>
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
    <!--Modal para agregar película-->
    <div>
      <b-modal id="modal-1" title="Nueva película" hide-footer>
        <div>
          <b-form @submit.prevent="submitForm">
            <b-form-group
              id="name"
              label="Name"
              label-for="name"
              :state="!errors.name ? true : false"
              :invalid-feedback="errors.name"
            >
              <b-form-input
                id="name"
                v-model="name"
                type="text"
                placeholder="Nombre de la película"
                required
              ></b-form-input>
            </b-form-group>
            <b-form-group
              id="duration"
              label="Duración"
              label-for="duration"
              :state="!errors.duration ? true : false"
              :invalid-feedback="errors.duration"
            >
              <b-form-input
                id="duration"
                v-model="duration"
                type="number"
                placeholder="Duración de la película en minutos"
                required
              ></b-form-input>
            </b-form-group>

            <b-form-group
              id="gender"
              label="Género"
              label-for="gender"
              :state="!errors.gender ? true : false"
              :invalid-feedback="errors.gender"
            >
              <b-form-select
                id="gender"
                v-model="gender"
                :options="genderOptions"
                placeholder="Seleccione el género de la película"
                required
              ></b-form-select>
            </b-form-group>
            <!--Categoría-->
            <b-form-group
              id="category"
              label="Categoria"
              label-for="category"
              :state="!errors.category ? true : false"
              :invalid-feedback="errors.category"
            >
              <b-form-select
                id="category"
                v-model="category"
                :options="categoryOptions"
                placeholder="Seleccione la categoría de la película"
                required
              ></b-form-select>
            </b-form-group>
            <!--Director-->
            <b-form-group
              id="director"
              label="Director"
              label-for="director"
              :state="!errors.director ? true : false"
              :invalid-feedback="errors.director"
            >
              <b-form-input
                id="director"
                v-model="director"
                type="text"
                placeholder="Director de la película"
                required
              ></b-form-input>
            </b-form-group>

            <!--Fecha de publicación-->
            <b-form-group
              id="publishDate"
              label="Fecha de publicación"
              label-for="publishDate"
              :state="!errors.publishDate ? true : false"
              :invalid-feedback="errors.publishDate"
            >
              <b-form-input
                id="publishDate"
                v-model="publishDate"
                type="text"
                placeholder="Fecha de publicación de la película"
                required
              ></b-form-input>
            </b-form-group>
            <b-button
              type="submit"
              variant="primary"
              @click="$bvModal.hide('modal-1')"
              >Registrar</b-button
            >
          </b-form>
        </div>
        <b-button class="mt-3" block @click="$bvModal.hide('modal-1')"
          >Cancelar</b-button
        >
      </b-modal>
    </div>
  </div>
</template>
<script>
import { get } from "lodash";
import {
  postMovie,
  getMovies,
  deleteMovie,
  updateMovie,
  getMovieById,
} from "../src/network/index";
import Vue from "vue";
import LoadingOverlay from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

export default Vue.extend({
  components: {
    LoadingOverlay,
  },
  data() {
    return {
      name: "",
      duration: null,
      gender: "",
      director: "",
      category: "",
      publishDate: "",
      loading: false,
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
    async deleteMovieById(id) {
      try {
        this.loading = true;
        await deleteMovie(id);
        await this.fetchMovies();
      } finally {
        this.loading = false;
      }
    },
    async submitForm() {
      this.errors = {};
      if (!/^[a-zA-Z\s\W]+$/.test(this.name)) {
        this.errors.name = "El nombre de la película no puede estar vacío";
      }
      if (!/^[a-zA-Z0-9\s]+$/.test(this.duration)) {
        this.errors.duration =
          "La duración de la película se debe ingresar en minutos";
      }
      if (!/^[a-zA-Z\s\W]+$/.test(this.gender)) {
        this.errors.gender = "El género de la película no puede estar vacío";
      }
      if (!/^[a-zA-Z\s\W]+$/.test(this.director)) {
        this.errors.gender = "El director de la película no puede estar vacío";
      }
      if (!/^[a-zA-Z\s\W]+$/.test(this.category)) {
        this.errors.gender = "La categoría de la película no puede estar vacío";
      }
      if (!/^\d{4}-\d{2}-\d{2}$/.test(this.publishDate)) {
        this.errors.publishDate =
          "El formato de la fecha no es correcto, debe ser YYYY-MM-DD";
      }
      if (Object.keys(this.errors).length === 0) {
        try {
          this.loading = true;
          await postMovie(
            this.name,
            this.duration,
            this.gender,
            this.director,
            this.category,
            this.publishDate
          );
          await this.fetchMovies();
        } finally {
          this.loading = false;
          this.name = "";
          this.duration = "";
          this.gender = "";
          this.director = "";
          this.category = "";
          this.publishDate = "";
        }
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
  justify-content: space-between;
  margin: 3%;
}
.cardContainer {
  padding: 1%;
}
.buttonContainer {
  display: flex;
  justify-content: end;
  padding: 1%;
}
</style>
