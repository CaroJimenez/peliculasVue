<template>
  <div>
    <b-button @click="openModal">Open Modal</b-button>

    <b-modal v-model="showModal" title="Add Movie">
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
        <!--Imagen-->
        <b-form-group id="file" label-for="file">
          <b-form-file
            v-model="file"
            :state="Boolean(file)"
            placeholder="Selecciona una imagen"
          ></b-form-file>
        </b-form-group>
        <b-button type="submit" variant="primary">Registrar</b-button>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import { postMovie } from "../network";
export default {
  data() {
    return {
      showModal: false,
      name: "",
      duration: null,
      gender: "",
      director: "",
      category: "",
      publishDate: "",
      file: null,
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
  methods: {
    openModal() {
      this.showModal = true;
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
          this.showModal = false;
          this.loading = true;
          this.$emit("loading-changed", this.loading);
          await postMovie(
            this.name,
            this.duration,
            this.gender,
            this.director,
            this.category,
            this.publishDate,
            this.file
          );
        } finally {
          this.$emit("movie-added");
          this.loading = false;
          this.$emit("loading-changed", this.loading);
          this.name = "";
          this.duration = "";
          this.gender = "";
          this.director = "";
          this.category = "";
          this.publishDate = "";
          this.file = null;
          this.showModal = false;
        }
      }
    },
  },
};
</script>
<style scoped></style>
